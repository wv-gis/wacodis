import { Component, OnInit } from '@angular/core';
import { TimeseriesEntryComponent, ExportOptions, ExportData } from '@helgoland/depiction';


interface TimePeriod {
  from: Date;
  to: Date;
}

@Component({
  selector: 'wv-extended-timeseries-entry',
  templateUrl: './wv-extended-timeseries-entry.component.html',
  styleUrls: ['./wv-extended-timeseries-entry.component.scss']
})
export class WvExtendedTimeseriesEntryComponent extends TimeseriesEntryComponent {
  loading = this.loading;
  public display = 'hidden';
  public exportOptions: ExportOptions;
  public inputId: string;
  // pre-define variable metadata to avoid errors (undefined)
  public metadata: ExportData = {
    phenomenon: null,
    uom: null,
    firstvalue: null,
    lastvalue: null,
    timeperiod: {
      from: new Date(),
      to: new Date()
    },
    timezone: null,
    station: null
  };
  public timeperiod: TimePeriod;
  public timezone: string;
  public disabled = false;


  public onDownload(dwType: string): void {
    this.exportOptions = {
      downloadType: dwType,
      timeperiod: {
        from: this.metadata.timeperiod.from,
        to: this.metadata.timeperiod.to
      },
      timezone: this.metadata.timezone
    };
  }
  public onMetadata(metadata: ExportData): void {
    this.metadata = metadata;
    console.log(this.metadata);
    this.disabled = true;
  }
  public onCloseHandled(): void {
    this.display = 'hidden';
    // this.loading = !this.loading;
  }
  downloadDataset() {
    this.display = 'visible';
  }
  onLoading() {
    // this.loading = !this.loading;
  }
}
