import * as wppconnect from '../index';
import * as assert from 'assert';
import { sleep } from '../utils/sleep';

describe('QRCode test', function () {
  let client: wppconnect.Whatsapp = null;

  this.timeout(20000);

  before(async function () {
    wppconnect.defaultLogger.level = 'none';

    client = await wppconnect.create({
      session: 'qrcode-reader',
      waitForLogin: false,
      autoClose: 0,
    });

    await client.waitForPageLoad();
  });

  after(async function () {
    await client.close();
  });

  it('Get QRCode', async function () {
    const result = await client.getQrCode();
    assert.ok(result);
    assert.ok(result.urlCode);
    assert.ok(result.base64Image);
  });

  it('Await QRCode change', async function () {
    this.timeout(60000);

    const first = await client.getQrCode();
    await sleep(25000);
    const second = await client.getQrCode();

    assert.ok(second);
    assert.ok(second.urlCode !== first.urlCode);
    assert.ok(second.base64Image !== first.base64Image);
  });
});
