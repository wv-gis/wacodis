import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategorySelectorComponent } from './category-selector/category-selector.component';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { PhenomenonSelectorComponent } from './phenomenon-selector/phenomenon-selector.component';
import { HelgolandLabelMapperModule } from '@helgoland/depiction/label-mapper';
import { ExtendedListSelectorComponent } from './extended-list-selector/extended-list-selector.component';
import { PhenomenonListSelectorComponent } from './phenomenon-list-selector/phenomenon-list-selector.component';
import { StationListSelectorComponent } from './station-list-selector/station-list-selector.component';
import { ServiceModule } from '../service-selector/service-selector/service.module';
import { ExtendedMultiservicefilterComponent } from './extended-multiservicefilter/extended-multiservicefilter.component';
import { ExtendedServiceFilterSelectorComponent } from './extended-service-filter-selector/extended-service-filter-selector.component';
import { CategoryEntryComponent } from './entry-content/category-entry/category-entry.component';




@NgModule({
  imports: [
    CommonModule,
    HelgolandSelectorModule,
    HelgolandLabelMapperModule,
    ServiceModule,
  ],
  declarations: [CategorySelectorComponent, PhenomenonSelectorComponent,
     ExtendedListSelectorComponent, PhenomenonListSelectorComponent, 
     StationListSelectorComponent, ExtendedMultiservicefilterComponent,
    ExtendedServiceFilterSelectorComponent, CategoryEntryComponent],
  exports: [CategorySelectorComponent, PhenomenonSelectorComponent, 
    PhenomenonListSelectorComponent, StationListSelectorComponent,
     ExtendedMultiservicefilterComponent, ExtendedServiceFilterSelectorComponent],

})

export class FilterModule {

}