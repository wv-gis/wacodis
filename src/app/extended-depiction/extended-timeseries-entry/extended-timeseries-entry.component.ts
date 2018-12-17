import { Component } from "@angular/core";
import { TimeseriesEntryComponent } from "@helgoland/depiction";

@Component({
    selector: 'wv-extended-timeseries-entry',
    templateUrl: './extended-timeseries-entry.component.html',
    styleUrls: ['./extended-timeseries-entry.component.scss']
})

export class ExtendedTimeseriesEntryComponent extends TimeseriesEntryComponent{
    loading = this.loading;
}