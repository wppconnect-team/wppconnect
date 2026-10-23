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

const puppeteerConfig = {
  whatsappUrl: 'https://web.whatsapp.com',
  /**
   * Default launch and performance flags for headless/container environments.
   * They do not disable browser protection; callers that need the flags in
   * `protectionDisablingChromiumArgs` must opt in explicitly.
   */
  chromiumArgs: [
    // `--app=${WAUrl}`,
    '--log-level=3', // fatal only
    //'--start-maximized',
    '--no-default-browser-check',
    '--no-experiments',
    '--ignore-gpu-blacklist',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-default-apps',
    '--enable-features=NetworkService',
    // Extras
    '--disable-webgl',
    '--disable-infobars',
    '--window-position=0,0',
    '--disable-threaded-animation',
    '--disable-threaded-scrolling',
    '--disable-in-process-stack-traces',
    '--disable-histogram-customizer',
    '--disable-gl-extensions',
    '--disable-composited-antialiasing',
    '--disable-canvas-aa',
    '--disable-3d-apis',
    '--disable-accelerated-2d-canvas',
    '--disable-accelerated-jpeg-decoding',
    '--disable-accelerated-mjpeg-decode',
    '--disable-app-list-dismiss-on-blur',
    '--disable-accelerated-video-decode',
    '--disable-dev-shm-usage',
    '--autoplay-policy=no-user-gesture-required',
    '--disable-blink-features=AutomationControlled',
  ],
  /**
   * Flags that disable browser protections. They are never applied by default:
   * use `useInsecureChromiumArgs: true` or add them to `browserArgs` when an
   * environment explicitly requires them (for example a container that cannot
   * use the Chromium sandbox).
   */
  protectionDisablingChromiumArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--ignore-certificate-errors',
    '--disable-site-isolation-trials',
  ],
};

export { puppeteerConfig };
