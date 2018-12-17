import { Injectable } from '@angular/core';
import { DatasetService, DatasetOptions, LocalStorage, ColorService } from '@helgoland/core';


@Injectable({
  providedIn: 'root',
})
export class DatasetEmitService extends DatasetService<DatasetOptions | DatasetOptions[]>{

  dataOptions: DatasetOptions[];
  internID: string;

  constructor(protected localStorage: LocalStorage) {
    super();
  }

  protected createStyles(internalId: string): DatasetOptions {
  // this.color.getColor();
  const option = new DatasetOptions(internalId, "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
   return option;
  }

  protected saveState(): void {
    this.datasetOptions.forEach((entry) => { 
      if(entry[0]){
        this.internID = entry[0].internalId
      }
       });
    this.localStorage.save(this.datasetIds.indexOf(this.internID).toString(), this.datasetOptions);
  }
  protected loadState(): void {
    return this.localStorage.load(this.internID);
  }

}
