import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExtendedDatasetTableComponent } from "./extended-dataset-table/extended-dataset-table.component";
import { ExtendedTimeseriesEntryComponent } from "./extended-timeseries-entry/extended-timeseries-entry.component";
import { HelgolandLabelMapperModule } from "@helgoland/depiction";

@NgModule({
  imports: [
    CommonModule,
    HelgolandLabelMapperModule
  ],
  declarations: [ExtendedDatasetTableComponent, ExtendedTimeseriesEntryComponent],
  exports: [ExtendedDatasetTableComponent, ExtendedTimeseriesEntryComponent],
})



export class ExtendedDepictionModule {

}