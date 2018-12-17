import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';

import { CategorySelectorComponent } from './category-selector/category-selector.component';
import { PhenomenonSelectorComponent } from './phenomenon-selector/phenomenon-selector.component';
import { PhenomenonListSelectorComponent } from './phenomenon-list-selector/phenomenon-list-selector.component';
import { StationListSelectorComponent } from './station-list-selector/station-list-selector.component';
import { ExtendedSelectorModule } from '../extended-selector/extended-selector.module';
import { HelgolandCoreModule } from '@helgoland/core';
import { DatasetEmitService } from '../services/dataset-emit.service';
import { SelectedUrlService } from '../services/selected-url.service';
// import { DatasetEmitService } from '../services/dataset-emit.service';

// export function DatasetEmitFactory(localstorage: LocalStorage){
//   return new DatasetEmitService(localstorage);
// }
@NgModule({
  imports: [
    CommonModule,
    HelgolandSelectorModule,
    HelgolandLabelMapperModule,
    ExtendedSelectorModule,
    HelgolandCoreModule
    
  ],
  declarations: [CategorySelectorComponent, PhenomenonSelectorComponent,
     PhenomenonListSelectorComponent, 
     StationListSelectorComponent],
  exports: [CategorySelectorComponent, PhenomenonSelectorComponent, 
    PhenomenonListSelectorComponent, StationListSelectorComponent,],
    // providers: [ {provide: DatasetService, useFactory: DatasetEmitService, deps: [LocalStorage]} ]
// providers:[ SelectedUrlService]

})

export class FilterModule {

}