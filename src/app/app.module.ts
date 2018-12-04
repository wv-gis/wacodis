import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import {
  DatasetApiInterface,
  SplittedDataDatasetApiInterface,
  HelgolandCoreModule,
  SettingsService,
  Settings,
  //StatusCheckService,
  LocalStorage,
  DatasetService,
  ColorService,
  HttpService,
  StatusIntervalResolverService,
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
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MapModule } from './map/map.module';
import { DataDepictionModule } from './data-depiction/data-depiction.module';
import { MenuModule } from './selection-menu/menu.module';
import { HelgolandSelectorModule, ListSelectorService } from '@helgoland/selector';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandControlModule } from '@helgoland/control';
import { HelgolandTimeModule } from '@helgoland/time';
import { ExtendedSelectorModule } from './extended-selector/extended-selector.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SelectViewDashboardComponent } from './select-view-dashboard/select-view-dashboard.component';

import { FilterModule } from './filter-selector/filter.module';
import { ExtendedSettingsService } from './settings/settings.service';
import { settings } from '../environments/environment';
import { DatasetEmitService } from './services/dataset-emit.service';
import { ExtendedDepictionModule } from './extended-depiction/extended-depiction.module';
import { SelectedUrlService } from './services/selected-url.service';
import { RestApiService } from './services/rest-api.service';

import {MatCardModule, MatButtonModule, MatDialogModule, MatCheckboxModule, MatSelectModule, MatFormFieldModule} from '@angular/material';
import { StyleModificationComponent } from './component-views/style-modification/style-modification.component';
import { StyleModificationModule } from './component-views/style-modification/style-modification.module';





export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export function DatasetEmitFactory(localstorage: LocalStorage){
  return new DatasetEmitService(localstorage);
}

@NgModule({
  declarations: [
    AppComponent,
    SelectViewDashboardComponent,
    // StyleModificationComponent,

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
    MenuModule,
    FilterModule,
    ExtendedSelectorModule,
    ExtendedDepictionModule,
    MatCardModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatCheckboxModule, 
    MatSelectModule,MatFormFieldModule, StyleModificationModule,
   BrowserAnimationsModule,
  ],
  entryComponents: [
    StyleModificationComponent,
  ],
  providers: [
    // {
    //   provide: StatusCheckService,     
    //   useFactory: (client: HttpClient) => {
    //     return new StatusCheckService(client);
    //   },
    //   deps: [SettingsService, HttpClient]
    // },
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface,
    },
    {
      provide: SettingsService,
      useClass: ExtendedSettingsService
    },
    // {
    //   provide: DatasetEmitService,
    //   useFactory: DatasetEmitFactory,
    //   deps: [LocalStorage]
    // },
    {
      provide: DatasetService,
      useFactory: DatasetEmitFactory,
      deps:[LocalStorage]
      }, 
      RestApiService,StatusIntervalResolverService,
    SelectedUrlService,// HttpService
    
    
   
  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule],
})
export class AppModule { }



