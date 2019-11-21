import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectionMapComponent } from 'src/app/map/map-view/selection-map/selection-map.component';
import { ComparisonViewComponent } from 'src/app/change-detection/view/comparison-view/comparison-view.component';
import { LandingpageComponent } from 'src/app/landingpage/landingpage.component';
import { ReportsViewComponent } from 'src/app/reports/reports-view/reports-view.component';
import { ProfileViewComponent } from 'src/app/profiles/profile-view/profile-view.component';
import { WvDataViewComponent } from 'src/app/timeseries/data-selection/wv-data-view/wv-data-view.component';
import { TimeseriesViewComponent } from 'src/app/timeseries/depiction/timeseries-view/timeseries-view.component';
import { ComparisonSelectionViewComponent } from 'src/app/change-detection/view/comparison-selection-view/comparison-selection-view.component';
import { WeatherForecastComponent } from 'src/app/weather/weather-forecast/weather-forecast.component';
import { AppComponent } from 'src/app/app.component';
import { SelectionViewComponent } from './reports/selection/selection-view/selection-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'map-view', component: SelectionMapComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'change-detection', component: ComparisonViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'comparison-selection', component: ComparisonSelectionViewComponent , data: { title: 'WaCoDiS Web Client' } },
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
  { path: 'profiles', component: ProfileViewComponent, data: { title: 'WaCoDiS Web Client' } },
  { path: 'weather-forecast', component: WeatherForecastComponent, data: { title: 'WaCoDiS Web Client' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
