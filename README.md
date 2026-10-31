**English** | [Português (Brasil)](./README.pt-BR.md)

<p align="center">
  <a href="https://wppconnect.io/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://wppconnect-team.github.io/brand/wppconnect-dark.png" />
      <img src="https://wppconnect-team.github.io/brand/wppconnect-light.png" alt="WPPConnect" width="220" height="121" />
    </picture>
  </a>
</p>

# WPPConnect

Control WhatsApp Web from Node.js applications.

A project in the WPPConnect ecosystem, maintained by WPPConnect Team.

[Getting started](#getting-started) | [Documentation](#documentation) | [Contributing](#contributing) | [Support WPPConnect](#support-the-project)

[![License: LGPL-3.0-or-later](https://img.shields.io/badge/license-LGPL--3.0--or--later-blue)](./LICENSE.md) [![npm version](https://img.shields.io/npm/v/@wppconnect-team/wppconnect)](https://www.npmjs.com/package/@wppconnect-team/wppconnect) [![CI](https://github.com/wppconnect-team/wppconnect/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/wppconnect-team/wppconnect/actions/workflows/build.yml) [![Open Collective](https://img.shields.io/badge/Open%20Collective-WPPConnect-blue)](https://opencollective.com/wppconnect)

## Overview

For developers building bots and integrations who want to manage the browser and session lifecycle in their own application. WPPConnect combines Puppeteer with the browser automation layer used by the ecosystem.

## Features

- Send and receive text, images, video, audio, documents, contacts, locations and stickers.
- Manage multiple sessions, QR pairing, chats, contacts and groups.
- Handle incoming messages and session events through the JavaScript/TypeScript API.

## Getting started

Use Node.js and npm, plus Chrome/Chromium and its operating-system dependencies. CI builds with Node.js 24.22.2; the package does not declare a minimum Node version.

```sh
npm install @wppconnect-team/wppconnect
```

Save this as `index.cjs`, run `node index.cjs`, and scan the QR code with WhatsApp Linked devices. Send `ping` from an authorized test contact to receive `pong`.

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

## Configuration

Pass session and browser options to `create(...)`; see [client creation](docs/getting-started/creating-client.md). Store session credentials privately. WhatsApp Web changes can require package updates; review release notes and deprecations when upgrading.

## Documentation

- [Installation guide](https://wppconnect.io/docs/tutorial/basics/installation)
- [API reference](https://wppconnect.io/wppconnect/)
- [Runnable examples](./examples/)
- [Retained technical details and acknowledgments](documentation/readme-reference.md)

## WPPConnect ecosystem

| Project | Purpose | When to use it |
| --- | --- | --- |
| [WPPConnect/WA-JS](https://github.com/wppconnect-team/wa-js) | Expose WhatsApp Web functions through the browser-side `WPP` API. | Run browser-side code in WhatsApp Web. |
| [WPPConnect Server](https://github.com/wppconnect-team/wppconnect-server) | Run a REST API for WhatsApp sessions, messages and webhooks. | Expose session and messaging operations over HTTP. |
| [WPPConnect Manager](https://github.com/wppconnect-team/wppconnect-manager) | Manage WPPConnect Server sessions and conversations in a self-hosted web workspace. | Operate compatible Server sessions and chats through a UI. |

## Support the project

WPPConnect is maintained by an open-source community. Your support helps fund maintenance, infrastructure, documentation, and the people working on the ecosystem.

If WPPConnect helps your project or business, consider making a one-time contribution or becoming a recurring supporter.

**[Support WPPConnect on Open Collective](https://opencollective.com/wppconnect)**

Contributions are voluntary. See the official page for current financial information. You can also help with code, tests, documentation, translations and well-described issue reports.

Additional official beneficiaries in [.github/FUNDING.yml](.github/FUNDING.yml): [joaosouz4dev](https://github.com/sponsors/joaosouz4dev), [manfe](https://github.com/sponsors/manfe).

## Contributing

Contributions of code, tests, examples, documentation and translations are welcome. For larger changes, discuss the approach in an issue first. Include the project/runtime versions, a minimal reproduction and sanitized logs when reporting a problem. Update both `README.md` and `README.pt-BR.md` in the same change when installation, configuration, features, examples, licensing or funding changes.

Read [CONTRIBUTING.md](CONTRIBUTING.md).

After installing the development dependencies, use the repository checks relevant to your change:

```sh
npm run build
npm run lint
npm test
```

Account-dependent examples and tests require separate validation with an authorized test account. Never attach credentials or session files to an issue.

## Community and support

Use [repository issues](https://github.com/wppconnect-team/wppconnect/issues) for reproducible bugs and feature proposals. For usage questions, join the community through the official channels:

- [Discord](https://discord.gg/JU5JGGKGNG)
- [Telegram](https://t.me/wppconnect)
- [YouTube](https://www.youtube.com/c/wppconnect)

This project is independent and is not affiliated with or endorsed by WhatsApp or Meta. Follow applicable terms and obtain authorization for account and messaging operations.

## License

[GNU Lesser General Public License v3.0 or later (LGPL-3.0-or-later)](./LICENSE.md).

WPPConnect Team and contributors.

The original legal document and existing copyright notices are preserved. Third-party components retain their own terms.
