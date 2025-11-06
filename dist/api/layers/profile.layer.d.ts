import { Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { StatusLayer } from './status.layer';
export declare class ProfileLayer extends StatusLayer {
    page: Page;
    constructor(page: Page, session?: string, options?: CreateConfig);
    /**
     * @category Chat
     * @param contactsId Example: 0000@c.us | [000@c.us, 1111@c.us]
     * @param time duration of silence
     * @param type kind of silence "hours" "minutes" "year"
     * To remove the silence, just enter the contact parameter
     */
    sendMute(id: string, time: number, type: string): Promise<object>;
    /**
     * Change the theme
     * @category Host
     * @param string types "dark" or "light"
     */
    setTheme(type: string): Promise<boolean>;
    /**
     * Sets current user profile status
     * @category Profile
     * @param status
     */
    setProfileStatus(status: string): Promise<void>;
    /**
     * Gets current user profile status
     * @category Profile
     */
    getProfileStatus(): Promise<string>;
    /**
     * Sets the user's current profile photo
     * @category Profile
     * @param name
     */
    setProfilePic(pathOrBase64: string, to?: string): Promise<boolean>;
    /**
     * Sets current user profile name
     * @category Profile
     * @param name
     */
    setProfileName(name: string): Promise<boolean>;
    /**
     * Gets the current user profile name
     * @category Profile
     */
    getProfileName(): Promise<string>;
    /**
     * Remove your profile picture
     * @category Profile
     */
    removeMyProfilePicture(): Promise<boolean>;
}
