import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapViewComponent } from './map/map-view/service-selection-map/map-view.component';
import { DataTableComponent } from './data-depiction/data-table/data-table.component';
import { GraphViewComponent } from './data-depiction/timeseries-graph-view/graph-view.component';
import { SelectViewDashboardComponent } from './select-view-dashboard/select-view-dashboard.component';
import { TimespanMapComponent } from './map/map-view/timespan-map/timespan-map.component';
import { RasterMapComponent } from './map/map-view/raster-map/raster-map.component';

const routes: Routes = [
  { path: '' , redirectTo: 'start', pathMatch: 'full'},
  { path: 'selection-map', component: MapViewComponent, data: { title: 'WaCoDiS Web Client'}},
  { path: 'diagram', component: DataTableComponent, data: { title: 'Tabellenansicht'}},
  { path: 'timeseries', component: GraphViewComponent, data: { title: 'WaCoDiS Web Client'}},
  { path: 'start', component: SelectViewDashboardComponent, data: { title: 'WaCoDiS Web Client'}},
  { path: 'timespan-map', component: TimespanMapComponent, data: { title: 'WaCoDiS Web Client'}},
  { path: 'raster-map', component: RasterMapComponent, data: { title: 'WaCoDiS Web Client'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
