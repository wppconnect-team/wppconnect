import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const output = resolve('api-docs');
const base = 'https://wppconnect.io/wppconnect/';
const redirects = {
  'variables/WAJS.webpack.isInjected.html': 'variables/WAJS.isInjected.html',
  'variables/WAJS.webpack.__debug.html': 'variables/WAJS.loader.__debug.html',
  'variables/WAJS.webpack.webpackRequire.html':
    'variables/WAJS.loader.moduleRequire.html',
  'modules/WAJS.webpack.html': 'modules/WAJS.loader.html',
  'functions/WAJS.webpack.onReady.html': 'functions/WAJS.loader.onReady.html',
  'interfaces/WAJS.ev.WebpackEvents.html':
    'interfaces/WAJS.ev.LoaderEvents.html',
  'pages/getting-started/installation.html':
    'https://wppconnect.io/docs/tutorial/basics/installation/',
};

for (const [oldPath, target] of Object.entries(redirects)) {
  const destination = new URL(target, base);
  if (destination.href.startsWith(base)) {
    await access(resolve(output, target));
  }

  const file = resolve(output, oldPath);
  await mkdir(dirname(file), { recursive: true });
  const html = [
    '<!doctype html><html lang="en"><meta charset="utf-8">',
    '<title>Documentation moved</title>',
    '<link rel="canonical" href="' + destination.href + '">',
    '<meta http-equiv="refresh" content="0; url=' + destination.href + '">',
    '<p>Documentation moved. <a href="' +
      destination.href +
      '">Open the current reference</a>.</p></html>',
  ].join('\n');
  await writeFile(file, html, { flag: 'wx' });
}

// TypeDoc uses the directory URL in the home page's canonical link.
const sitemap = resolve(output, 'sitemap.xml');
const xml = await readFile(sitemap, 'utf8');
const canonicalXml = xml.replace(
  '<loc>' + base + 'index.html</loc>',
  '<loc>' + base + '</loc>'
);
const locations = Array.from(
  canonicalXml.matchAll(/<loc>([^<]+)<\/loc>/g),
  (match) => match[1]
);
if (!locations.includes(base))
  throw new Error('Missing API reference home in sitemap');
for (const url of locations) {
  if (!url.startsWith(base)) throw new Error('Unexpected sitemap URL: ' + url);
  const path = decodeURIComponent(url.slice(base.length)) || 'index.html';
  const html = await readFile(resolve(output, path), 'utf8');
  const canonicals =
    html.split('</head>', 1)[0].match(/<link\b[^>]*\brel="canonical"[^>]*>/g) ??
    [];
  if (
    canonicals.length !== 1 ||
    !canonicals[0].includes('href="' + url + '"')
  ) {
    throw new Error('Invalid canonical on ' + url);
  }
}
await writeFile(sitemap, canonicalXml);
