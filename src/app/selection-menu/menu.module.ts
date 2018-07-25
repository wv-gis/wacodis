import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { ExtendedSelectorModule } from '../extended-selector/extended-selector.module';

import { SelectionMenuComponent } from './options-view/selection-menu.component';
import { ExtendedSettingsService } from '../settings/settings.service';
import { DepictionMenuComponent } from './depiction-menu/depiction-menu.component';
import { HelgolandTimeModule } from '@helgoland/time';
import { DatasetMenuComponent } from './dataset-menu/dataset-menu.component';
import { HelgolandCoreModule, DatasetService, LocalStorage, HttpService } from '@helgoland/core';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
// import { DatasetEmitService } from '../services/dataset-emit.service';
import { TabsComponent, TabComponent } from './tabs/tabs.component';
import { DatasetEmitService } from '../services/dataset-emit.service';
import { HttpClientModule } from '@angular/common/http';
import { ExtendedDepictionModule } from '../extended-depiction/extended-depiction.module';






@NgModule({
  imports: [
    CommonModule,
    ExtendedSelectorModule,
    AppRoutingModule,
    HelgolandTimeModule,
    HelgolandCoreModule,
    HelgolandDatasetlistModule,
      AppRoutingModule,ExtendedDepictionModule,
  ],
  declarations: [SelectionMenuComponent, DepictionMenuComponent, DatasetMenuComponent, TabsComponent, TabComponent],
  exports: [SelectionMenuComponent,DepictionMenuComponent, DatasetMenuComponent, TabComponent, TabsComponent],
  providers: [ExtendedSettingsService],
})

export class MenuModule {

}