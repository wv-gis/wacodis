import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategorySelectorComponent} from './category-selector/category-selector.component';
import {HelgolandSelectorModule} from '@helgoland/selector';
import {PhenomenonSelectorComponent} from './phenomenon-selector/phenomenon-selector.component';


@NgModule({
    imports: [
      CommonModule,
      HelgolandSelectorModule,
    ],
    declarations: [CategorySelectorComponent,PhenomenonSelectorComponent],
    exports: [CategorySelectorComponent, PhenomenonSelectorComponent ]
  })

  export class FilterModule {

  }