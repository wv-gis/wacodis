import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewComponent } from './map-view/service-selection-map/map-view.component';
import { HelgolandMapModule } from '@helgoland/map';
import { HelgolandMapViewModule } from '@helgoland/map';
import { TimespanMapComponent } from './map-view/timespan-map/timespan-map.component';
import { RasterMapComponent } from './map-view/raster-map/raster-map.component';
import { ServiceModule } from '../selection-menu/service.module';
import {FilterModule} from '../filter-selector/filter.module';
import { HelgolandMapSelectorModule } from '@helgoland/map';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  imports: [
    CommonModule,
    HelgolandMapModule,
    HelgolandMapViewModule,
    ServiceModule,
    HelgolandMapSelectorModule,
    HelgolandSelectorModule,
    HelgolandLabelMapperModule,
    FilterModule,
    AppRoutingModule,
  ],
  declarations: [MapViewComponent, TimespanMapComponent, RasterMapComponent],
  exports: [MapViewComponent, TimespanMapComponent, RasterMapComponent]
})
export class MapModule { }
