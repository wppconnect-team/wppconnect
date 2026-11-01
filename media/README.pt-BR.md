[English](./README.md) | **Português (Brasil)**

<p align="center">
  <a href="https://wppconnect.io/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://wppconnect-team.github.io/brand/v2/wppconnect-dark.png" />
      <img src="https://wppconnect-team.github.io/brand/v2/wppconnect-light.png" alt="WPPConnect" width="220" height="121" />
    </picture>
  </a>
</p>

# WPPConnect

Controle o WhatsApp Web em aplicações Node.js.

Um projeto do ecossistema WPPConnect, mantido pela WPPConnect Team.

[Primeiros passos](#primeiros-passos) | [Documentação](#documentação) | [Como contribuir](#como-contribuir) | [Apoie a WPPConnect](#apoie-o-projeto)

[![License: LGPL-3.0-or-later](https://img.shields.io/badge/license-LGPL--3.0--or--later-blue)](./LICENSE.md) [![npm version](https://img.shields.io/npm/v/@wppconnect-team/wppconnect)](https://www.npmjs.com/package/@wppconnect-team/wppconnect) [![CI](https://github.com/wppconnect-team/wppconnect/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/wppconnect-team/wppconnect/actions/workflows/build.yml) [![Open Collective](https://img.shields.io/badge/Open%20Collective-WPPConnect-blue)](https://opencollective.com/wppconnect)

## Visão geral

Para desenvolvedores de bots e integrações que querem gerenciar o navegador e o ciclo de vida das sessões na própria aplicação. A WPPConnect combina Puppeteer com a camada de automação no navegador usada pelo ecossistema.

## Funcionalidades

- Envie e receba texto, imagens, vídeo, áudio, documentos, contatos, localizações e stickers.
- Gerencie múltiplas sessões, pareamento por QR, conversas, contatos e grupos.
- Trate mensagens recebidas e eventos de sessão pela API JavaScript/TypeScript.

## Primeiros passos

Use Node.js e npm, além de Chrome/Chromium e suas dependências do sistema operacional. O CI compila com Node.js 24.22.2; o pacote não declara uma versão mínima do Node.

```sh
npm install @wppconnect-team/wppconnect
```

Salve como `index.cjs`, execute `node index.cjs` e leia o QR code em Aparelhos conectados do WhatsApp. Envie `ping` de um contato de teste autorizado para receber `pong`.

```javascript
const wppconnect = require("@wppconnect-team/wppconnect");

wppconnect.create({ session: "readme-demo" })
  .then((client) => {
    client.onMessage(async (message) => {
      if (!message.isGroupMsg && message.body === "ping") {
        await client.sendText(message.from, "pong");
      }
    });
  })
  .catch(console.error);
```

## Configuração

Passe as opções de sessão e navegador para `create(...)`; consulte a [criação do cliente](docs/getting-started/creating-client.md). Guarde as credenciais de sessão em local privado. Mudanças no WhatsApp Web podem exigir atualizações do pacote; confira as notas de versão e depreciações ao atualizar.

## Documentação

- [Guia de instalação](https://wppconnect.io/docs/tutorial/basics/installation)
- [Referência da API](https://wppconnect.io/wppconnect/)
- [Exemplos executáveis](./examples/)
- [Detalhes técnicos e agradecimentos preservados](documentation/readme-reference.md)

## Ecossistema WPPConnect

| Projeto | Finalidade | Quando usar |
| --- | --- | --- |
| [WPPConnect/WA-JS](https://github.com/wppconnect-team/wa-js) | Exponha funções do WhatsApp Web pela API `WPP` no navegador. | Executar código no navegador dentro do WhatsApp Web. |
| [WPPConnect Server](https://github.com/wppconnect-team/wppconnect-server) | Execute uma API REST para sessões, mensagens e webhooks do WhatsApp. | Expor operações de sessão e mensagens por HTTP. |
| [WPPConnect Manager](https://github.com/wppconnect-team/wppconnect-manager) | Gerencie sessões e conversas do WPPConnect Server em uma aplicação web auto-hospedada. | Operar sessões e conversas de um Server compatível pela interface. |

## Apoie o projeto

A WPPConnect é mantida por uma comunidade de código aberto. Seu apoio ajuda a financiar a manutenção, a infraestrutura, a documentação e o trabalho das pessoas que desenvolvem o ecossistema.

Se a WPPConnect ajuda seu projeto ou sua empresa, considere fazer uma contribuição pontual ou apoiar de forma recorrente.

**[Apoie a WPPConnect no Open Collective](https://opencollective.com/wppconnect)**

As contribuições são voluntárias. Consulte a página oficial para acompanhar as informações financeiras atuais. Você também pode ajudar com código, testes, documentação, traduções e relatos de problemas bem descritos.

Beneficiários oficiais adicionais em [.github/FUNDING.yml](.github/FUNDING.yml): [joaosouz4dev](https://github.com/sponsors/joaosouz4dev), [manfe](https://github.com/sponsors/manfe).

## Como contribuir

Contribuições de código, testes, exemplos, documentação e traduções são bem-vindas. Para mudanças maiores, discuta a proposta em uma issue primeiro. Ao relatar um problema, informe as versões do projeto/runtime, uma reprodução mínima e logs sem dados sensíveis. Atualize `README.md` e `README.pt-BR.md` na mesma alteração quando mudar instalação, configuração, funcionalidades, exemplos, licença ou arrecadação.

Leia [CONTRIBUTING.md](CONTRIBUTING.md).

Após instalar as dependências de desenvolvimento, use as verificações pertinentes à sua alteração:

```sh
npm run build
npm run lint
npm test
```

Exemplos e testes que dependem de conta exigem validação separada com uma conta de teste autorizada. Nunca anexe credenciais ou arquivos de sessão a uma issue.

## Comunidade e suporte

Use as [issues do repositório](https://github.com/wppconnect-team/wppconnect/issues) para bugs reproduzíveis e propostas de funcionalidades. Para dúvidas de uso, participe pelos canais oficiais:

- [Discord](https://discord.gg/JU5JGGKGNG)
- [Telegram](https://t.me/wppconnect)
- [YouTube](https://www.youtube.com/c/wppconnect)

Este projeto é independente e não é afiliado nem endossado pelo WhatsApp ou pela Meta. Siga os termos aplicáveis e obtenha autorização para operações de conta e mensagens.

## Licença

[GNU Lesser General Public License v3.0 or later (LGPL-3.0-or-later)](./LICENSE.md).

WPPConnect Team and contributors.

O documento jurídico original e os avisos de autoria existentes são preservados. Componentes de terceiros mantêm seus próprios termos.
