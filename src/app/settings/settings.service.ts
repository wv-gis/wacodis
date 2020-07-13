import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { settings } from '../../environments/environment';

export interface ExtendedSettings extends Settings {
    reservoirs?: [{
        id: string,
        label: string,
        graph: {
            seriesId: string,
            compSeriesId?: string,
            referenceValues?: ReportReferenceValues[],
            rainSeriesID?: string;
            compYearsFrom?: number[],
        }
    }]
}
export declare class ReportReferenceValues {
    referenceId: string;
    label: string;
}

/**
 * Extended Settings Definition
 */
@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {
    constructor() {
        super();
        this.setSettings(settings);

    }
}