import { Component, OnInit } from '@angular/core';
import { TimeseriesEntryComponent } from '@helgoland/depiction';

@Component({
  selector: 'wv-extended-timeseries-entry',
  templateUrl: './wv-extended-timeseries-entry.component.html',
  styleUrls: ['./wv-extended-timeseries-entry.component.scss']
})
export class WvExtendedTimeseriesEntryComponent extends TimeseriesEntryComponent {
  loading = this.loading;
}
