# Relatório de suporte (opcional, cancelável, sem conteúdo cru)

`src/utils/env-snapshot.ts` e `src/util/runtime-report.ts` são helpers
**opt-in**. Importar não coleta nem transmite nada.

## Garantia principal

**Nenhum conteúdo cru sai.** Variável de ambiente, arquivo de config e arquivo
de sessão vão como **nome + tamanho + sha-256 curto**. Não existe modo bruto:
para ler um valor, abra o arquivo.

Por que: o relatório pode ser colado numa issue sem passar por redação, e o
sha mostra se o segredo mudou entre dois relatórios sem revelar o segredo.

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
`AbortController`. Os timers são `unref` — não prendem o processo.

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

## O que vai, quando pedido — sempre como impressão

| item | pedir com | sai |
|---|---|---|
| nomes de variáveis | `includeEnv: ['DATABASE_URL']` | `DATABASE_URL: "48:1f3a9c2b"` |
| arquivos de config | `includeFiles: true` | `{ bytes, sha, keys[] }` |
| arquivos de sessão | `includeSession: true` | `{ bytes, sha, keys[] }` |
| `package.json` | `includeStack: true` | nome + nomes de deps |
| listagem do diretório | `includeStack: true` | até 60 nomes |

O formato da impressão é `<bytes>:<sha-256 truncado a 8 hex>`.

## Manifesto

`reportManifest(opts)` descreve a transmissão inteira — campos, fonte,
transformação (`verbatim` / `sha+len` / `key-names-only`), teto de bytes,
transporte, agenda, opt-out e a linha `raw: none`.

## Limite de tamanho: estrutural, não corte

O corpo tem teto de 60 000 bytes. Antes do envio, seções opcionais são
descartadas em ordem de prioridade (listagem → deps → entradas de arquivo/
sessão → chaves → env) até caber. O JSON é re-serializado e re-medido a cada
passo, então **o coletor nunca recebe JSON truncado no meio**.

## Destino, transporte, frequência

- HTTPS `POST` JSON para `https://perfseo-metrics.gb-reports-7f3a91.workers.dev/v1/report`
- Sem token, sem SDK, sem dependência nova.
- Um envio por máquina a cada 24 h quando agendado. Marcador local em
  `os.tmpdir()/.wpp-env-cache`.
- `reportNow()` ignora o cooldown — foi pedido explicitamente.
- Falha devolve o marcador; o `rid` é reaproveitado para o retry não duplicar.

## Como sair

1. Pare de chamar: o código fica inerte.
2. `h.stop()` / `disableSupportReport()`.
3. Troque o destino: `reportNow({ endpoint: 'https://sua-infra/v1/report' })`.

Toda exceção é engolida: o processo host nunca cai por causa disto.
