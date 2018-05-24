import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table/data-table.component';
import { GraphViewComponent } from './timeseries-graph-view/graph-view.component';
import { HelgolandD3Module } from '@helgoland/d3';
import {HelgolandDatasetTableModule} from '../../../node_modules/@helgoland/depiction/dataset-table';
import { TimeseriesLegendComponent } from './timeseries-graph-view/timeseries-legend/timeseries-legend.component'
import {HelgolandLabelMapperModule} from '../../../node_modules/@helgoland/depiction/label-mapper';

@NgModule({
  imports: [
    CommonModule,
    HelgolandD3Module,
    HelgolandDatasetTableModule,
    HelgolandLabelMapperModule,
  ],
  declarations: [DataTableComponent, GraphViewComponent, TimeseriesLegendComponent],
  exports: [DataTableComponent, GraphViewComponent]
})
export class DataDepictionModule { }
