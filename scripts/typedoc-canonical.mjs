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
}
