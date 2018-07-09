import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HelgolandSelectorModule } from "@helgoland/selector";
import { HelgolandLabelMapperModule } from "@helgoland/depiction";
import { TranslateModule } from "@ngx-translate/core";

import { ExtendedMultiservicefilterComponent } from "./extended-multiservicefilter/extended-multiservicefilter.component";
import { ExtendedServiceFilterSelectorComponent } from "./extended-service-filter-selector/extended-service-filter-selector.component";
import { ExtendedListSelectorComponent } from "./extended-list-selector/extended-list-selector.component";
import { ExtendedServiceSelectorComponent } from './extended-service-selector/extended-service-selector.component';
import { HelgolandCoreModule } from "@helgoland/core";



@NgModule({
    imports: [
      CommonModule,
      HelgolandSelectorModule,
      HelgolandLabelMapperModule,
      TranslateModule,
      HelgolandCoreModule
    ],
    declarations: [ ExtendedMultiservicefilterComponent,
      ExtendedServiceFilterSelectorComponent, ExtendedListSelectorComponent, ExtendedServiceSelectorComponent],
    exports: [ExtendedMultiservicefilterComponent,
        ExtendedServiceFilterSelectorComponent, ExtendedListSelectorComponent, ExtendedServiceSelectorComponent],
  
  })
  
  export class ExtendedSelectorModule {
  
  }