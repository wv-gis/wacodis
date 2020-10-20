import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandCoreModule, SettingsService, SplittedDataDatasetApiInterface,
   DatasetApiInterface, DatasetService, DatasetApiV1ConnectorProvider,
    DatasetApiV2ConnectorProvider, DatasetApiV3ConnectorProvider} from '@helgoland/core';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
import { HelgolandSelectorModule, ListSelectorService } from '@helgoland/selector';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandControlModule } from '@helgoland/control';
import { HelgolandTimeModule } from '@helgoland/time';
import { HelgolandFacetSearchModule } from '@helgoland/facet-search';

import {
  HelgolandMapModule,
  HelgolandMapSelectorModule,
  HelgolandMapControlModule,
  HelgolandMapViewModule,
  GeoSearch,
  NominatimGeoSearchService
} from '@helgoland/map';
import {SensorwappToolboxModule} from "@sensorwapp-toolbox/core";
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
import { RequestTokenService } from 'src/app/services/request-token.service';
import { HelgolandOpenLayersModule } from '@helgoland/open-layers';
import { SelectedProviderService } from './services/selected-provider.service';
import { CopernicusProductsModule } from './copernicus/copernicus-products/copernicus-products.module';
import { SwatResultsModule } from './swat/views/swat-results/swat-results.module';







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
    HelgolandFacetSearchModule,
    SensorwappToolboxModule,
    FormsModule,
    WvMapModule,
    WvTimeseriesModule,
    WvProfilesModule,
    WvReportsModule,
    WvChangeDetectionModule,
    SwatResultsModule,
    CopernicusProductsModule,
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
  
    CsvDataService, RequestTokenService,SelectedProviderService,
    DatasetApiV1ConnectorProvider, DatasetApiV2ConnectorProvider, DatasetApiV3ConnectorProvider
    // {provide: APP_INITIALIZER,
    //   useFactory: HttpLoaderFactory,
    //   deps:[SelectedProviderService]  
    // }

  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}