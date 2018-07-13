import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandDatasetTableModule , HelgolandLabelMapperModule,  HelgolandDatasetlistModule } from '@helgoland/depiction';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandControlModule } from '@helgoland/control';
import { HelgolandTimeModule } from '@helgoland/time';
import { HelgolandMapModule , HelgolandMapViewModule } from '@helgoland/map';
// import { HelgolandTimeModule } from '@helgoland/time';

import { TrajectoryViewComponent } from './trajectory-view/trajectory-view.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { DataTableComponent } from './data-table/data-table.component';
import { GraphViewComponent } from './timeseries-graph-view/graph-view.component';
import { HelgolandCoreModule } from '@helgoland/core';
import { MenuModule } from '../selection-menu/menu.module';
import { DatasetEmitService } from '../services/dataset-emit.service';

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
    // HelgolandTimeRangeSliderModule,
    HelgolandMapViewModule,
    HelgolandCoreModule,
    MenuModule
  ],
  declarations: [DataTableComponent, GraphViewComponent, TrajectoryViewComponent, ProfileViewComponent],
  exports: [DataTableComponent, GraphViewComponent, TrajectoryViewComponent, ProfileViewComponent,],
  providers: [DatasetEmitService],
})
export class DataDepictionModule { }
