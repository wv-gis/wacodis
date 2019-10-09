import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandCoreModule, SettingsService, SplittedDataDatasetApiInterface, DatasetApiInterface, DatasetService} from '@helgoland/core';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
import { HelgolandSelectorModule, ListSelectorService } from '@helgoland/selector';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandControlModule } from '@helgoland/control';
import { HelgolandTimeModule } from '@helgoland/time';
import {
  HelgolandMapModule,
  HelgolandMapSelectorModule,
  HelgolandMapControlModule,
  HelgolandMapViewModule,
  GeoSearch,
  NominatimGeoSearchService
} from '@helgoland/map';
import { ExtendedSettingsService } from './settings/settings.service';
import { WvMapModule } from 'src/app/map/map.module';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { WvTimeseriesModule } from 'src/app/timeseries/timeseries.module';
import { WvProfilesModule } from 'src/app/profiles/profiles.module';
import { WvReportsModule } from 'src/app/reports/reports.module';
import { WvChangeDetectionModule } from 'src/app/change-detection/change-detection.module';
import { DatasetEmitServiceService } from 'src/app/services/dataset-emit-service.service';
import { WeatherForecastComponent } from './weather/weather-forecast/weather-forecast.component';
import { CsvDataService } from 'src/app/settings/csvData.service';
import { ComparisonSelectionService } from 'src/app/services/comparison-selection.service';
import { RequestTokenService } from 'src/app/services/request-token.service';
import { HelgolandOpenLayersModule } from '@helgoland/open-layers';



@NgModule({
  declarations: [
    AppComponent,
    LandingpageComponent,
    WeatherForecastComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HelgolandD3Module,
    HelgolandCoreModule,
    HelgolandTimeModule,
    HelgolandSelectorModule,
    HelgolandDatasetlistModule,
    HelgolandMapModule,
    HelgolandMapControlModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
    HelgolandModificationModule,
    HelgolandControlModule,
    HelgolandOpenLayersModule,
    WvMapModule,
    WvTimeseriesModule,
    WvProfilesModule,
    WvReportsModule,
    WvChangeDetectionModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface,
    },
    {
      provide: SettingsService,
      useClass: ExtendedSettingsService
    },
    {
      provide: GeoSearch,
      useClass: NominatimGeoSearchService
    },
    {
      provide: DatasetService,
      useClass: DatasetEmitServiceService
    }, 
  
    CsvDataService, ComparisonSelectionService, RequestTokenService

  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}