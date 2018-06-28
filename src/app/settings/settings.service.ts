import { Injectable } from "@angular/core";
import { SettingsService, Settings } from "@helgoland/core";
// import { settings } from '../../main.browser';
import {settings} from '../../environments/environment';

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {
    constructor() {
        super();
        this.setSettings(settings);
    }

}