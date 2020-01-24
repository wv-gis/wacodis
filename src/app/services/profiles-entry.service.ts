import { Injectable } from '@angular/core';
import { DatasetService, TimedDatasetOptions, LocalStorage, ColorService } from '@helgoland/core';

const PROFILES_OPTIONS_CACHE_PARAM = 'profilesOptions';
const PROFILES_IDS_CACHE_PARAM = 'profilesIds';

@Injectable({
  providedIn: 'root'
})
export class ProfilesEntryService  extends DatasetService<Array<TimedDatasetOptions>>{

  constructor( protected localStorage: LocalStorage,
    private color: ColorService) { 
    super();
    this.loadState();
  }

  protected createStyles(internalId: string): TimedDatasetOptions[] {
    return [new TimedDatasetOptions(internalId, this.color.getColor(), 0)];
  }
  protected saveState(): void {
    this.localStorage.save(PROFILES_IDS_CACHE_PARAM, this.datasetIds);
    this.localStorage.save(PROFILES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
  }
  protected loadState(): void {
    const options = this.localStorage.loadArray<Array<TimedDatasetOptions>>(PROFILES_OPTIONS_CACHE_PARAM) || [];
    options.forEach(e => this.datasetOptions.set(e[0].internalId, e));
    this.datasetIds = this.localStorage.loadArray<string>(PROFILES_IDS_CACHE_PARAM) || [];
  
  }

  
}
