import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapViewComponent } from './map/map-view/service-selection-map/map-view.component';
import { DataTableComponent } from './data-depiction/data-table/data-table.component';
import { GraphViewComponent } from './data-depiction/timeseries-graph-view/graph-view.component';
import { SelectViewDashboardComponent } from './select-view-dashboard/select-view-dashboard.component';
import { TimespanMapComponent } from './map/map-view/timespan-map/timespan-map.component';
import { RasterMapComponent } from './map/map-view/raster-map/raster-map.component';

const routes: Routes = [
  { path: '' , redirectTo: 'selectViewDashboard', pathMatch: 'full'},
  { path: 'map', component: MapViewComponent, data: { title: 'Kartenansicht'}},
  { path: 'table', component: DataTableComponent, data: { title: 'Tabellenansicht'}},
  { path: 'timeseries', component: GraphViewComponent, data: { title: 'Zeitreihenansicht'}},
  { path: 'selectViewDashboard', component: SelectViewDashboardComponent, data: { title: 'Kartenauswahl'}},
  { path: 'timespanMap', component: TimespanMapComponent, data: { title: 'Zeitverfolgung'}},
  { path: 'rasterMap', component: RasterMapComponent, data: { title: 'RasterKartenansicht'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
