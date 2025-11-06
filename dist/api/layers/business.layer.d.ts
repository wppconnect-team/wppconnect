import { Page } from 'puppeteer';
import { ControlsLayer } from './controls.layer';
import { CreateConfig } from '../../config/create-config';
export declare class BusinessLayer extends ControlsLayer {
    page: Page;
    constructor(page: Page, session?: string, options?: CreateConfig);
    /**
     * Querys product catalog
     * @param id Buisness profile id ('00000@c.us')
     */
    getBusinessProfilesProducts(id: string): Promise<any>;
    /**
     * Get Business Profile
     * @param id Buisness profile id ('00000@c.us')
     */
    getBusinessProfile(id: string): Promise<any>;
    /**
     * Querys order catalog
     * @param messageId string
     * @returns Message object
     */
    getOrderbyMsg(messageId: string): Promise<any>;
    /**
   * Update your business profile
   *
   * @example
   * ```javascript
   * await client.editBusinessProfile({description: 'New description for profile'});
   * ```
   *
   * ```javascript
   * await client.editBusinessProfile({categories: {
      id: "133436743388217",
      localized_display_name: "Artes e entretenimento",
      not_a_biz: false,
    }});
   * ```
   *
   * ```javascript
   * await client.editBusinessProfile({address: 'Street 01, New York'});
   * ```
   *
   * ```javascript
   * await client.editBusinessProfile({email: 'test@test.com.br'});
   * ```
   *
   * Change website of profile (max 2 sites)
   * ```javascript
   * await client.editBusinessProfile({website: [
    "https://www.wppconnect.io",
    "https://www.teste2.com.br",
  ]});
   * ```
   *
   * Change businessHours for Specific Hours
   * ```javascript
   * await client.editBusinessProfile({ businessHours: {
   * {
        tue: {
          mode: "specific_hours",
          hours: [
            [
              540,
              1080,
            ],
          ],
        },
        wed: {
          mode: "specific_hours",
          hours: [
            [
              540,
              1080,
            ],
          ],
        },
        thu: {
          mode: "specific_hours",
          hours: [
            [
              540,
              1080,
            ],
          ],
        },
        fri: {
          mode: "specific_hours",
          hours: [
            [
              540,
              1080,
            ],
          ],
        },
        sat: {
          mode: "specific_hours",
          hours: [
            [
              540,
              1080,
            ],
          ],
        },
        sun: {
          mode: "specific_hours",
          hours: [
            [
              540,
              1080,
            ],
          ],
        },
      }
    },
    timezone: "America/Sao_Paulo"
    });
   *
   * Change businessHours for Always Opened
   * ```javascript
   * await client.editBusinessProfile({ businessHours: {
      {
        mon: {
          mode: "open_24h",
        },
        tue: {
          mode: "open_24h",
        },
        wed: {
          mode: "open_24h",
        },
        thu: {
          mode: "open_24h",
        },
        fri: {
          mode: "open_24h",
        },
        sat: {
          mode: "open_24h",
        },
        sun: {
          mode: "open_24h",
        },
      }
      timezone: "America/Sao_Paulo"
    });
   *
   * Change businessHours for Appointment Only
   * ```javascript
   * await client.editBusinessProfile({ businessHours: { {
      mon: {
        mode: "appointment_only",
      },
      tue: {
        mode: "appointment_only",
      },
      wed: {
        mode: "appointment_only",
      },
      thu: {
        mode: "appointment_only",
      },
      fri: {
        mode: "appointment_only",
      },
      sat: {
        mode: "appointment_only",
      },
      sun: {
        mode: "appointment_only",
      },
    }
      timezone: "America/Sao_Paulo"
    });
   *
   *
   * ```
   */
    editBusinessProfile(options: any): Promise<any>;
    /**
     * Sends product with product image to given chat id
     * @param to Chat id
     * @param base64 Base64 image data
     * @param caption Message body
     * @param businessId Business id number that owns the product ('0000@c.us')
     * @param productId Product id, see method getBusinessProfilesProducts for more info
     */
    sendImageWithProduct(to: string, base64: string, caption: string, businessId: string, productId: string): Promise<void>;
}
