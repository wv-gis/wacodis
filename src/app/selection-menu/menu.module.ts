import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { ExtendedSelectorModule } from '../extended-selector/extended-selector.module';

import { SelectionMenuComponent } from './options-view/selection-menu.component';
import { ExtendedSettingsService } from '../settings/settings.service';
import { DepictionMenuComponent } from './depiction-menu/depiction-menu.component';
import { HelgolandTimeModule } from '@helgoland/time';
import { DatasetMenuComponent } from './dataset-menu/dataset-menu.component';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
import { DatasetEmitService } from '../services/dataset-emit.service';
import { TabsComponent, TabComponent } from './tabs/tabs.component';
import { FilterModule } from '../filter-selector/filter';
import { MapModule } from '../map/map.module';



@NgModule({
  imports: [
    CommonModule,
    ExtendedSelectorModule,
    AppRoutingModule,
    HelgolandTimeModule,
    HelgolandCoreModule,
    HelgolandDatasetlistModule,
    FilterModule, MapModule
  ],
  declarations: [SelectionMenuComponent, DepictionMenuComponent, DatasetMenuComponent, TabsComponent, TabComponent],
  exports: [SelectionMenuComponent,DepictionMenuComponent, DatasetMenuComponent, TabComponent, TabsComponent],
  providers: [ExtendedSettingsService, DatasetEmitService],
})

export class MenuModule {

}