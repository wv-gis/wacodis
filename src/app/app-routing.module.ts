import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectionMapComponent } from 'src/app/map/map-view/selection-map/selection-map.component';
import { ComparisonViewComponent } from 'src/app/change-detection/view/comparison-view/comparison-view.component';
import { LandingpageComponent } from 'src/app/landingpage/landingpage.component';
import { ReportsViewComponent } from 'src/app/reports/reports-view/reports-view.component';
import { ProfileEntryGraphComponent } from 'src/app/profiles/profile-entry-graph/profile-entry-graph.component';
import { WvDataViewComponent } from 'src/app/timeseries/data-selection/wv-data-view/wv-data-view.component';
import { TimeseriesViewComponent } from 'src/app/timeseries/depiction/timeseries-view/timeseries-view.component';
import { WeatherForecastComponent } from 'src/app/weather/weather-forecast/weather-forecast.component';
import { SelectionViewComponent } from './reports/selection/selection-view/selection-view.component';
import { ProfileDataViewSelectionComponent } from './profiles/data-selection/profile-data-view-selection/profile-data-view-selection.component';
import { MowingViewComponent } from './copernicus/products/mowing-view/mowing-view.component';
import { IsoplethenViewComponent } from './reports/isoplethen/isoplethen-view/isoplethen-view.component';
import { SoilTemperatureViewComponent } from './copernicus/products/soil-temperature-view/soil-temperature-view.component';
import { ChlorophyllViewComponent } from './copernicus/products/chlorophyll-view/chlorophyll-view.component';
import { VitalityViewComponent } from './copernicus/products/vitality-view/vitality-view.component';
import { LandCoverComponent } from './copernicus/products/land-cover/land-cover.component';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'map-view', component: SelectionMapComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'change-detection', component: ComparisonViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'selection-category', component: WvDataViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'selection-phenomenon', component: WvDataViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'selection-station', component: WvDataViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'selection-map', component: WvDataViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'start', component: LandingpageComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'timeseries-diagram', component: TimeseriesViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'reports/:id', component: SelectionViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'reports', component: SelectionViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'reports/TS/:id', component: ReportsViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'reports/TS', component: ReportsViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'profiles-selection', component: ProfileDataViewSelectionComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'profiles-diagram', component: ProfileEntryGraphComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'weather-forecast', component: WeatherForecastComponent, data: { title: 'WaCoDiS Web Client' } },
  // {path: "substrance-entries-view",component: },
  {path: "mowing-view",component: MowingViewComponent},
  {path: "isoplethen-view",component: IsoplethenViewComponent},
  {path: "soilTemperature-view",component: SoilTemperatureViewComponent},
  {path: "chlorophyll-view",component: ChlorophyllViewComponent},
  {path: "vitality-view",component: VitalityViewComponent},
  {path: "land-use-view", component: LandCoverComponent},
  {path: "land-use-view/:id",component: LandCoverComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
