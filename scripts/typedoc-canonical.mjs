import { readFileSync } from 'node:fs';
import { JSX } from 'typedoc';

export function load(app) {
  const base = app.options.getValue('hostedBaseUrl');
  app.renderer.hooks.on('head.end', ({ page }) => {
    // TypeDoc supplies the home page canonical through its sitemap plugin.
    if (page.url === 'index.html') return;
    return JSX.createElement('link', {
      rel: 'canonical',
      href: new URL(page.url, base).href,
    });
  });

  const manifest = new URL(
    '../node_modules/@wppconnect/wa-js/package.json',
    import.meta.url
  );
  const { version } = JSON.parse(readFileSync(manifest, 'utf8'));
  app.renderer.hooks.on('content.begin', ({ page }) => {
    if (!/\/WAJS\./.test(page.url)) return;
    return JSX.createElement(
      'p',
      null,
      'The Node.js SDK re-exports the WAJS namespace for TypeScript. This reference describes types from ',
      JSX.createElement(
        'a',
        {
          href:
            'https://github.com/wppconnect-team/wa-js/releases/tag/v' + version,
        },
        'WA-JS ' + version
      ),
      '. For operations available on a connected Node.js client, see ',
      JSX.createElement(
        'a',
        { href: new URL('classes/Whatsapp.html', base).href },
        'Whatsapp'
      ),
      '. For functions running inside WhatsApp Web, see the ',
      JSX.createElement(
        'a',
        { href: 'https://wppconnect.io/wa-js/' },
        'WA-JS browser API'
      ),
      '.'
    );
  });
}
