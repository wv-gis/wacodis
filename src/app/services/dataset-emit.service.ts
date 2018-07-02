import { Injectable} from '@angular/core';
import { IDataset, DatasetService, DatasetOptions } from '@helgoland/core';
import { FilterModule } from '../filter-selector/filter';
import { DataDepictionModule } from '../data-depiction/data-depiction.module';

@Injectable({
  providedIn: 'root'
})
export class DatasetEmitService extends DatasetService<DatasetOptions>{
 
 colors = [];
 dataOptions: DatasetOptions;
internID: string;

  protected createStyles(internalId: string): DatasetOptions {
   this.dataOptions = new DatasetOptions(internalId,"rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")" )
      return this.dataOptions;
  }
  
  protected saveState(): void {
  this.datasetOptions.forEach((entry) => { this.internID = entry.internalId});
   this.localStorage.save(this.datasetIds.indexOf(this.internID).toString(), this.datasetOptions);
  }
  protected loadState(): void {
    
  }

}
