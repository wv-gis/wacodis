import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table/data-table.component';
import { GraphViewComponent } from './timeseries-graph-view/graph-view.component';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandDatasetTableModule } from '@helgoland/depiction/dataset-table';

import { HelgolandLabelMapperModule } from '@helgoland/depiction/label-mapper';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandControlModule } from '@helgoland/control';
import { HelgolandTimeModule } from '@helgoland/time';
import { HelgolandDatasetlistModule } from '@helgoland/depiction/datasetlist';
import { TrajectoryViewComponent } from './trajectory-view/trajectory-view.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { HelgolandMapModule } from '@helgoland/map';
import { AppRoutingModule } from '../app-routing.module';
import { HelgolandTimeRangeSliderModule } from '@helgoland/time/time-range-slider';
import { HelgolandMapViewModule } from '@helgoland/map/view';

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
    HelgolandMapModule,
    AppRoutingModule,
    HelgolandTimeRangeSliderModule,
    HelgolandMapViewModule,
  ],
  declarations: [DataTableComponent, GraphViewComponent, TrajectoryViewComponent, ProfileViewComponent],
  exports: [DataTableComponent, GraphViewComponent, TrajectoryViewComponent, ProfileViewComponent]
})
export class DataDepictionModule { }
