import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceSelectorComponent} from './service-selector.component';
import {HelgolandSelectorModule} from '@helgoland/selector';
// import { PhenomenonSelectorComponent } from '../phenomenon-selector/phenomenon-selector.component';

@NgModule({
    imports: [
      CommonModule,
      HelgolandSelectorModule,
    ],
    declarations: [ServiceSelectorComponent],
    exports: [ServiceSelectorComponent ]
  })

  export class ServiceModule {

  }