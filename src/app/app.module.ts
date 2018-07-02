import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import {
  DatasetApiInterface,
  SplittedDataDatasetApiInterface,
  HelgolandCoreModule,
  SettingsService,
  Settings,
  StatusCheckService,
  LocalStorage,
} from '@helgoland/core';
import { HelgolandD3Module } from '@helgoland/d3';
import {
  HelgolandMapModule,
  HelgolandMapSelectorModule,
  HelgolandMapControlModule,
  HelgolandMapViewModule
} from '@helgoland/map';
import { HelgolandDatasetTableModule, HelgolandDatasetlistModule } from '@helgoland/depiction';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MapModule } from './map/map.module';
import { DataDepictionModule } from './data-depiction/data-depiction.module';
import { ServiceModule } from './selection-menu/service.module';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandControlModule } from '@helgoland/control';
import { HelgolandTimeModule } from '@helgoland/time';
import { ExtendedSelectorModule } from './extended-selector/extended-selector.module';

import { AppComponent } from './app.component';
import { SelectViewDashboardComponent } from './select-view-dashboard/select-view-dashboard.component';

import { FilterModule } from './filter-selector/filter.module';
import { ExtendedSettingsService } from './settings/settings.service';
import { settings } from '../environments/environment';
import { DatasetEmitService } from './services/dataset-emit.service';






export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    SelectViewDashboardComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),
    HelgolandD3Module,
    HelgolandCoreModule,
    HelgolandDatasetTableModule,
    HelgolandMapControlModule,
    HelgolandMapModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
    HelgolandDatasetlistModule,
    HelgolandModificationModule,
    HelgolandTimeModule,
    HelgolandControlModule,
    MapModule,
    DataDepictionModule,
    HelgolandSelectorModule,
    ServiceModule,
    FilterModule,
    ExtendedSelectorModule
  ],
  providers: [
    {
      provide: StatusCheckService,     
      useFactory: (client: HttpClient) => {
        return new StatusCheckService(client);
      },
      deps: [SettingsService, HttpClient]
    },
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    },
    {
      provide: SettingsService,
      useClass: ExtendedSettingsService
    },
    {
      provide: DatasetEmitService,
      useFactory: (localStore: LocalStorage) => {
        return new DatasetEmitService(localStore);
      },
      deps: [LocalStorage]
    }
    
    
    
   
  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule],
})
export class AppModule { }



