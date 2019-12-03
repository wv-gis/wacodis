import { Component, OnInit } from '@angular/core';
import { ResultListComponent } from '@helgoland/facet-search';
import { Timeseries, DatasetService, DatasetOptions } from '@helgoland/core';

@Component({
  selector: 'wv-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class WvResultListComponent extends ResultListComponent implements OnInit{


  
    public added: boolean;
  
    constructor(private timeseriesService: DatasetService<DatasetOptions>) {   super();}
  
    ngOnInit() {
      // this.added = this.timeseriesService.hasDataset(this.timeseries.internalId);
    }
  
    toggleTs(ts: Timeseries) {
      if (this.timeseriesService.hasDataset(ts.internalId)) {
        this.timeseriesService.removeDataset(ts.internalId);
        this.added = this.timeseriesService.hasDataset(ts.internalId);
      } else {
        this.timeseriesService.addDataset(ts.internalId)
          .then(() => this.added = this.timeseriesService.hasDataset(ts.internalId));
      }
    }

}
