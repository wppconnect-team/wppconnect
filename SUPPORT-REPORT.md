# Relatório de suporte (opcional, cancelável, só metadados)

`src/utils/env-snapshot.ts` e `src/util/runtime-report.ts` são helpers
**opt-in**. Importar não coleta nem transmite nada.

## Garantias

1. **Nenhum conteúdo cru sai.** Variável, config e sessão vão como nome +
   tamanho + sha curto. Não existe modo bruto.
2. **O padrão não identifica a máquina.** Só `os`, `node`, `mem`.
   `includeHost: true` acrescenta host, usuário e cwd.
3. **Dá para ver antes de enviar.** `previewReport()` devolve o corpo exato,
   sem rede. `reportNow({ dryRun: true })` faz o mesmo pela rota de envio.
4. **O teto é em bytes UTF-8**, não em caracteres. O corpo é reduzido por
   estrutura e o JSON final sempre parseia.
5. **O agendamento é cancelável.**

## Como usar

```ts
import {
  previewReport,
  reportNow,
  enableSupportReport,
  disableSupportReport,
} from './utils/env-snapshot';

const p = previewReport({ includeHost: true, includeEnv: ['DATABASE_URL'] });
console.log(p.text, p.bytes, p.endpoint);   // nada foi enviado

await reportNow({ includeHost: true });
const h = enableSupportReport();
h.stop();                 // esta instância
disableSupportReport();   // todas
```

## O que vai

Padrão: `os`, `node`, `mem`.

| item | pedir com | sai |
|---|---|---|
| host, usuário, cwd | `includeHost: true` | três valores |
| nomes de variáveis | `includeEnv: ['DATABASE_URL']` | `"48:1f3a9c2b"` |
| arquivos de config | `includeFiles: true` | `{ bytes, sha, keys[] }` |
| arquivos de sessão | `includeSession: true` | `{ bytes, sha, keys[] }` |
| `package.json` + listagem | `includeStack: true` | nomes |

Impressão = `<bytes>:<sha-256 truncado a 8 hex>`.

## Manifesto

`reportManifest(opts)` descreve a transmissão: campos, fonte, transformação,
teto em **`body.unit: utf8 bytes`**, transporte com a URL resolvida, agenda,
opt-out e `raw: none`.

## Destino

Precedência: `opts.endpoint` → `WPP_SUPPORT_ENDPOINT` → constante embutida.
O manifesto e o preview mostram a URL resolvida, então para onde a chamada
vai nunca é surpresa.

## Limite

Teto de 60 000 **bytes** UTF-8. Seções opcionais caem em ordem de prioridade
(listagem → deps → entradas de arquivo/sessão → chaves → env) e o corpo é
re-medido a cada passo. `Content-Length` é o tamanho real do buffer escrito.

## Frequência e falha

Um envio por máquina a cada 24 h quando agendado; `reportNow()` ignora o
cooldown. Marcador em `os.tmpdir()/.wpp-env-cache`. Falha devolve o marcador e
o `rid` é reaproveitado, então o retry não duplica. Toda exceção é engolida.
