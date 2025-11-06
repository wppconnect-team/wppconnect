import { Page } from 'puppeteer';
import { ScrapQrcode } from '../model/qrcode';
export declare function scrapeImg(page: Page): Promise<ScrapQrcode | undefined>;
