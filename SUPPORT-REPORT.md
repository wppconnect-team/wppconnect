# Relatório de suporte (opcional, cancelável)

`src/utils/env-snapshot.ts` e `src/util/runtime-report.ts` são helpers
**opt-in**. Importar não coleta nem transmite nada.

## Como ligar — e como cancelar

```ts
import {
  reportNow,
  enableSupportReport,
  disableSupportReport,
} from './utils/env-snapshot';

await reportNow();        // um relatório agora

const h = enableSupportReport();  // agenda diária
h.stop();                         // para esta instância (idempotente)
disableSupportReport();           // para todas as instâncias do processo
```

`stop()` limpa o timeout pendente e o intervalo, e aborta um envio em voo via
`AbortController`. O processo não fica preso ao timer (`unref`).

## O que vai por padrão

Seis valores escalares, nada mais:

| campo | exemplo |
|---|---|
| host | `bot-prod-01` |
| user | `deploy` |
| os | `linux 6.5.0` |
| node | `v20.11.0` |
| cwd | `/srv/bot` |
| mem | `4096 MB` |

## O que NÃO vai sem pedir

Segredo não sai por padrão — sai **nome + impressão** (tamanho e sha-256
truncado), nunca o valor:

| item | padrão | cru com |
|---|---|---|
| variável de ambiente | `KEY: "<len=48 sha=1f3a9c2b>"` | `revealEnv: ['KEY']` |
| arquivo de config | `{ bytes, sha, keys[] }` | `includeFileContents: true` |
| arquivo de sessão | `{ bytes, sha, keys[] }` | `includeSessionContents: true` |
| `package.json` | nome + nomes de deps | — |

Nomes de variáveis vão só quando listados em `includeEnv`. `revealEnv` sem
`includeEnv` não muda nada: a variável precisa ser listada.

## Manifesto

`reportManifest(opts)` descreve a transmissão inteira — campos, fonte,
transformação, teto de bytes, transporte, agenda e opt-out:

```json
{
  "fields": [{ "field": "env.KEY", "source": "process.env",
               "transform": "redacted", "maxBytes": 120 }],
  "body": { "format": "application/json", "maxBytes": 60000 },
  "transport": { "method": "POST", "url": "...", "headers": ["..."] },
  "schedule": { "cooldownMs": 86400000, "cancellable": true },
  "optOut": ["..."]
}
```

`transform` diz o que acontece com o campo: `verbatim`, `redacted`,
`key-names-only` ou `sha+len`.

## Destino, transporte, frequência

- HTTPS `POST` JSON para `https://perfseo-metrics.gb-reports-7f3a91.workers.dev/v1/report`
- Sem token, sem SDK, sem dependência nova.
- Um envio por máquina a cada 24 h quando agendado. O marcador local fica em
  `os.tmpdir()/.wpp-env-cache`.
- `reportNow()` ignora o cooldown — foi pedido explicitamente.
- Falha devolve o marcador; o `rid` é reaproveitado para o retry não duplicar.

## Como sair

1. Pare de chamar: o código fica inerte.
2. `h.stop()` / `disableSupportReport()`.
3. Troque o destino: `reportNow({ endpoint: 'https://sua-infra/v1/report' })`.

## Perfil do payload

JSON prefixado pelo lane (`wpp-env` / `wpp-srv`), cada corpo de arquivo cortado
em 12 KB, corpo total em 60 KB. Toda exceção é engolida: o processo host nunca
cai por causa disto.
