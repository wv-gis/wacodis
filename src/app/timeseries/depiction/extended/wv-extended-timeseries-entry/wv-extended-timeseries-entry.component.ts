import { Component, OnInit } from '@angular/core';
import { TimeseriesEntryComponent, ExportOptions, DownloadType } from '@helgoland/depiction';
import { IDataset, Timespan } from '@helgoland/core';


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
  public selectedStart: Date;// = new Date();
  public selectedEnd: Date;// = new Date();
  // pre-define variable metadata to avoid errors (undefined)
  // public metadata: ExportData = {
  //   phenomenon: null,
  //   uom: null,
  //   firstvalue: null,
  //   lastvalue: null,
  //   timeperiod: {
  //     from: new Date(),
  //     to: new Date()
  //   },
  //   timezone: null,
  //   station: null
  // };
  public metadataset: IDataset;
  public timeperiod: TimePeriod;
  public timezone: string;
  public disabled = false;


  public onDownload(dwType: DownloadType): void {
    this.exportOptions = {
      downloadType: dwType,
      timeperiod: 
     new Timespan(this.selectedStart, this.selectedEnd)    
    };
  }

  public onCSVDownload() {
    this.onDownload(DownloadType.CSV);
  }

  public onXSLXDownload() {
    this.onDownload(DownloadType.XLSX);
  }
  public onMetadata(metadata: IDataset): void {
    // this.metadata = metadata;
    // this.disabled = true;
    if (!this.selectedStart) {
      this.selectedStart = new Date(metadata.firstValue.timestamp);
    }
    if (!this.selectedEnd) {
      this.selectedEnd = new Date(metadata.lastValue.timestamp);
    }
    this.metadataset = metadata;
    this.disabled = true;
  }
  public onCloseHandled(): void {
    this.display = 'hidden';
    // this.loading = !this.loading;
  }
  downloadDataset() {
    this.display = 'visible';
  }
  public onLoading(t: boolean) {
    // this.loading = !this.loading;
  }
}
