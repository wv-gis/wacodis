import { Injectable } from '@angular/core';
import { DatasetService, DatasetOptions, LocalStorage } from '@helgoland/core';


@Injectable({
  providedIn: 'root',
})
export class DatasetEmitService extends DatasetService<DatasetOptions>{

  dataOptions: DatasetOptions;
  internID: string;

  constructor(protected localStorage: LocalStorage){
    super(localStorage);

  }

  protected createStyles(internalId: string): DatasetOptions {
    console.log('CreateStyle');
    return new DatasetOptions(internalId, "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")")

  }

  protected saveState(): void {
    this.datasetOptions.forEach((entry) => { this.internID = entry.internalId });
    this.localStorage.save(this.datasetIds.indexOf(this.internID).toString(), this.datasetOptions);
  }
  protected loadState(): void {
    return this.localStorage.load(this.internID);
  }

}
