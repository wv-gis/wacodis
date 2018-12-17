import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExtendedDatasetTableComponent } from "./extended-dataset-table/extended-dataset-table.component";
import { ExtendedTimeseriesEntryComponent } from "./extended-timeseries-entry/extended-timeseries-entry.component";
import { HelgolandLabelMapperModule } from "@helgoland/depiction";
import { ExtendedTimeshiftSelectorComponent } from './extended-timeshift-selector/extended-timeshift-selector.component';
import { HelgolandTimeModule } from "@helgoland/time";

@NgModule({
  imports: [
    CommonModule,
    HelgolandLabelMapperModule, HelgolandTimeModule
  ],
  declarations: [ExtendedDatasetTableComponent, ExtendedTimeseriesEntryComponent, ExtendedTimeshiftSelectorComponent],
  exports: [ExtendedDatasetTableComponent, ExtendedTimeseriesEntryComponent, ExtendedTimeshiftSelectorComponent],
})



export class ExtendedDepictionModule {

}