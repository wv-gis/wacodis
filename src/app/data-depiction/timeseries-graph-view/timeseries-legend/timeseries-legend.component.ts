import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wv-timeseries-legend',
  templateUrl: './timeseries-legend.component.html',
  styleUrls: ['./timeseries-legend.component.css']
})
export class TimeseriesLegendComponent implements OnInit {

  @Input('datasetIdsMultiple')
  public datasetIds: string[];


  constructor() { }

  ngOnInit() {
  }

}
