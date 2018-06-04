import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceSelectorComponent} from './service-selector.component';
import {HelgolandSelectorModule} from '@helgoland/selector';
import { SelectionMenuComponent } from '../options-view/selection-menu.component';
import { AppRoutingModule } from '../../app-routing.module';


@NgModule({
    imports: [
      CommonModule,
      HelgolandSelectorModule,
      AppRoutingModule
    ],
    declarations: [ServiceSelectorComponent,SelectionMenuComponent],
    exports: [ServiceSelectorComponent,SelectionMenuComponent ]
  })

  export class ServiceModule {

  }