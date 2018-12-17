import { Component, OnInit } from '@angular/core';
import { Timespan, DatasetOptions, DatasetService } from '@helgoland/core';
import { DatasetEmitService } from '../../services/dataset-emit.service';

@Component({
  selector: 'wv-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  public datasetIds = [  ];
  public selectedIds: string[] = [];

  // timeframe for which data should be fetched in table
  public timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());
  public isActive = true;
  public datasetOptions: Map<string, DatasetOptions> = new Map();
  constructor(private dataEmitService: DatasetService<DatasetOptions>) {
    if (dataEmitService && dataEmitService.hasDatasets()) {
      for (let k = 0; k < dataEmitService.datasetIds.length; k++) {
        this.datasetIds.push(dataEmitService.datasetIds[k]);
      }
    }

    const colors = [];
    dataEmitService.datasetOptions.forEach((option) => {
      colors.push(option.color)
      this.datasetIds.forEach((entry,i) => {
        this.datasetOptions.set(entry, new DatasetOptions(entry, colors[i]));
      });
    });
   
  }

  ngOnInit() {
  }
  timespanChanged(time: Timespan) {
    this.timespan = time;
  }

  menuIsActive(){
    if(this.isActive){
      const time = new Timespan(this.timespan.from-1, this.timespan.to);
      this.timespan = time;
      this.isActive = false;
      return false;
    }
    else{
      const time = new Timespan(this.timespan.from-1, this.timespan.to);
      this.timespan = time;
      this.isActive = true;
      return true;
    }
  }
  public select(event: string[]) {
    this.selectedIds = event;
}
  public removeDataset(id: string){
    const datasetIdx = this.datasetIds.indexOf(id);
    if(datasetIdx > -1){
      
      this.datasetIds.splice(datasetIdx, 1);
      this.datasetOptions.delete(id);
     
      this.dataEmitService.removeDataset(id);
   
    }
    const time = new Timespan(this.timespan.from-1, this.timespan.to);
    this.timespan = time;
   
  }
}
