import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { SelectionMenuComponent } from '../options-view/selection-menu.component';
import { AppRoutingModule } from '../../app-routing.module';
import { ExtendedServiceSelectorComponent } from '../extended-service-selector/extended-service-selector.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    HelgolandSelectorModule,
    AppRoutingModule, TranslateModule
  ],
  declarations: [SelectionMenuComponent, ExtendedServiceSelectorComponent],
  exports: [SelectionMenuComponent,]
})

export class ServiceModule {

}