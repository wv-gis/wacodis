import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table/data-table.component';
import { GraphViewComponent } from './timeseries-graph-view/graph-view.component';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandDatasetTableModule } from '../../../node_modules/@helgoland/depiction/dataset-table';
import { TimeseriesLegendComponent } from './timeseries-graph-view/timeseries-legend/timeseries-legend.component'
import { HelgolandLabelMapperModule } from '../../../node_modules/@helgoland/depiction/label-mapper';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandControlModule } from '@helgoland/control';
import { HelgolandTimeModule } from '@helgoland/time';
import { HelgolandDatasetlistModule } from '../../../node_modules/@helgoland/depiction/datasetlist';

@NgModule({
  imports: [
    CommonModule,
    HelgolandD3Module,
    HelgolandDatasetTableModule,
    HelgolandModificationModule,
    HelgolandControlModule,
    HelgolandTimeModule,
    HelgolandDatasetlistModule,
    HelgolandLabelMapperModule,
  ],
  declarations: [DataTableComponent, GraphViewComponent, TimeseriesLegendComponent],
  exports: [DataTableComponent, GraphViewComponent]
})
export class DataDepictionModule { }
