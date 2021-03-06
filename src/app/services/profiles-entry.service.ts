import { Injectable } from '@angular/core';
import { DatasetService, TimedDatasetOptions, LocalStorage, ColorService } from '@helgoland/core';

const PROFILES_OPTIONS_CACHE_PARAM = 'profilesOptions';
const PROFILES_IDS_CACHE_PARAM = 'profilesIds';

/**
 * Extends Abstract Service DatasetService to receive and style timeseries datasets and save the selected IDs for further selection
 */
@Injectable({
  providedIn: 'root'
})
export class ProfilesEntryService extends DatasetService<Array<TimedDatasetOptions>>{

  constructor(protected localStorage: LocalStorage,
    private color: ColorService) {
    super();
    this.loadState();
  }

  /**
   * add Dataset and add to saveState
   * @param internalId selected Internal Id of timeseries chosen
   * @param options options of the timeseries
   */
  public async addDataset(internalId: string, options?: Array<TimedDatasetOptions>): Promise<boolean> {
    if (this.datasetOptions.has(internalId)) {
      options.forEach(entry => {
        if (!this.datasetOptions.get(internalId).find(e => e.timestamp === entry.timestamp)) {
          this.datasetOptions.get(internalId).push(entry);
          this.saveState();
        }
      });
      return true;
    } else {
      return super.addDataset(internalId, options);
    }
  }
  /**
   * set styling of selected timeseries dataset
   * @param internalId 
   */
  protected createStyles(internalId: string): TimedDatasetOptions[] {
    return [new TimedDatasetOptions(internalId, this.color.getColor(), 0)];
  }
  /**
   * add selected timeseries to localStorage
   */
  protected saveState(): void {
    this.localStorage.save(PROFILES_IDS_CACHE_PARAM, this.datasetIds);
    this.localStorage.save(PROFILES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
  }
  /**
   * load selected Ids in the storage
   */
  protected loadState(): void {
    const options = this.localStorage.loadArray<Array<TimedDatasetOptions>>(PROFILES_OPTIONS_CACHE_PARAM) || [];
    options.forEach(e => this.datasetOptions.set(e[0].internalId, e));
    this.datasetIds = this.localStorage.loadArray<string>(PROFILES_IDS_CACHE_PARAM) || [];
  }


}
