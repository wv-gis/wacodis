import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { ExtendedSelectorModule } from '../extended-selector/extended-selector.module';

import { SelectionMenuComponent } from './options-view/selection-menu.component';
import { ExtendedSettingsService } from '../settings/settings.service';



@NgModule({
  imports: [
    CommonModule,
    ExtendedSelectorModule,
    AppRoutingModule,
  ],
  declarations: [SelectionMenuComponent],
  exports: [SelectionMenuComponent,],
  providers: [ExtendedSettingsService],
})

export class ServiceModule {

}