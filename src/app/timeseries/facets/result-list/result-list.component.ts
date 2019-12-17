import { Component, OnInit, Input } from '@angular/core';
import { ResultListComponent } from '@helgoland/facet-search';
import { Timeseries, DatasetService, DatasetOptions } from '@helgoland/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'wv-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class WvResultListComponent extends ResultListComponent implements OnInit {


  public added: boolean;
  public subscribe: Subscription

  constructor(private timeseriesService: DatasetService<DatasetOptions>, protected router: Router) { super(); }

  ngOnInit() {

    this.subscribe = this.facetSearchService.getResults().subscribe(ts => this.timeseries = ts);
  }

  toggleTs(ts: Timeseries) {
    if (this.timeseriesService.hasDataset(ts.internalId)) {
      this.timeseriesService.removeDataset(ts.internalId);
      this.added = this.timeseriesService.hasDataset(ts.internalId);
    } else {
      this.timeseriesService.addDataset(ts.internalId)
        .then(() => this.added = this.timeseriesService.hasDataset(ts.internalId));
    }
    this.router.navigateByUrl('/timeseries-diagram');
  }
  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }
}
