import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapViewComponent } from './map/map-view/service-selection-map/map-view.component';
import { DataTableComponent } from './data-depiction/data-table/data-table.component';
import { GraphViewComponent } from './data-depiction/timeseries-graph-view/graph-view.component';
import { SelectViewDashboardComponent } from './select-view-dashboard/select-view-dashboard.component';
import { TimespanMapComponent } from './map/map-view/timespan-map/timespan-map.component';
import { RasterMapComponent } from './map/map-view/raster-map/raster-map.component';
import { TrajectoryViewComponent } from './data-depiction/trajectory-view/trajectory-view.component';
import { ProfileViewComponent } from './data-depiction/profile-view/profile-view.component';
import { CategorySelectorComponent } from './filter-selector/category-selector/category-selector.component';
import { PhenomenonListSelectorComponent } from './filter-selector/phenomenon-list-selector/phenomenon-list-selector.component';
import { StationListSelectorComponent } from './filter-selector/station-list-selector/station-list-selector.component';
import { SelectionMenuComponent } from './selection-menu/options-view/selection-menu.component';



const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'selection-map', component: SelectionMenuComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'table', component: DataTableComponent, data: { title: 'Tabellenansicht' } },
  { path: 'timeseries', component: GraphViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'start', component: SelectViewDashboardComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'timespan-map', component: TimespanMapComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'raster-map', component: RasterMapComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'trajectory-view', component: TrajectoryViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'profile-view', component: ProfileViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'select-category', component: CategorySelectorComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'select-station', component: StationListSelectorComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'select-phenomenon', component: PhenomenonListSelectorComponent, data: { title: 'WaCoDiS Web Client' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
