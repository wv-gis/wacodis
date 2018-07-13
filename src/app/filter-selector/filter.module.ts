import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';
import { MenuModule } from '../selection-menu/menu.module';


import { CategorySelectorComponent } from './category-selector/category-selector.component';
import { PhenomenonSelectorComponent } from './phenomenon-selector/phenomenon-selector.component';
import { PhenomenonListSelectorComponent } from './phenomenon-list-selector/phenomenon-list-selector.component';
import { StationListSelectorComponent } from './station-list-selector/station-list-selector.component';
import { ExtendedSelectorModule } from '../extended-selector/extended-selector.module';
import { HelgolandCoreModule, DatasetService } from '@helgoland/core';
import { DatasetEmitService } from '../services/dataset-emit.service';


@NgModule({
  imports: [
    CommonModule,
    HelgolandSelectorModule,
    HelgolandLabelMapperModule,
    // MenuModule,
    ExtendedSelectorModule,
    HelgolandCoreModule
    
  ],
  declarations: [CategorySelectorComponent, PhenomenonSelectorComponent,
     PhenomenonListSelectorComponent, 
     StationListSelectorComponent],
  exports: [CategorySelectorComponent, PhenomenonSelectorComponent, 
    PhenomenonListSelectorComponent, StationListSelectorComponent,],
    providers: [ DatasetEmitService ]


})

export class FilterModule {

}