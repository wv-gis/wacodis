import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';
import { ServiceModule } from '../selection-menu/service.module';
// import { DatasetEmitService } from './datasetEmitService/datasetEmit.service';

import { CategorySelectorComponent } from './category-selector/category-selector.component';
import { PhenomenonSelectorComponent } from './phenomenon-selector/phenomenon-selector.component';
import { PhenomenonListSelectorComponent } from './phenomenon-list-selector/phenomenon-list-selector.component';
import { StationListSelectorComponent } from './station-list-selector/station-list-selector.component';
import { ExtendedSelectorModule } from '../extended-selector/extended-selector.module';

@NgModule({
  imports: [
    CommonModule,
    HelgolandSelectorModule,
    HelgolandLabelMapperModule,
    ServiceModule,
    ExtendedSelectorModule
  ],
  declarations: [CategorySelectorComponent, PhenomenonSelectorComponent,
     PhenomenonListSelectorComponent, 
     StationListSelectorComponent],
  exports: [CategorySelectorComponent, PhenomenonSelectorComponent, 
    PhenomenonListSelectorComponent, StationListSelectorComponent,],
    // providers: [DatasetEmitService],

})

export class FilterModule {

}