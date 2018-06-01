import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategorySelectorComponent } from './category-selector/category-selector.component';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { PhenomenonSelectorComponent } from './phenomenon-selector/phenomenon-selector.component';
import { HelgolandLabelMapperModule } from '../../../node_modules/@helgoland/depiction/label-mapper';
import { ExtendedListSelectorComponent } from './extended-list-selector/extended-list-selector.component';
import { PhenomenonListSelectorComponent } from './phenomenon-list-selector/phenomenon-list-selector.component';
import { StationListSelectorComponent } from './station-list-selector/station-list-selector.component';



@NgModule({
  imports: [
    CommonModule,
    HelgolandSelectorModule,
    HelgolandLabelMapperModule,
  ],
  declarations: [CategorySelectorComponent, PhenomenonSelectorComponent, ExtendedListSelectorComponent, PhenomenonListSelectorComponent, StationListSelectorComponent],
  exports: [CategorySelectorComponent, PhenomenonSelectorComponent],

})

export class FilterModule {

}