import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsViewComponent } from './reports-view/reports-view.component';
import { HelgolandD3Module } from '@helgoland/d3';
import { ExtendedSettingsService } from 'src/app/settings/settings.service';
import { SelectionViewComponent } from './selection/selection-view/selection-view.component';
import { WvProfilesModule } from '../profiles/profiles.module';

@NgModule({
  imports: [
    CommonModule,
    HelgolandD3Module,
    WvProfilesModule
  ],
  declarations: [ReportsViewComponent, SelectionViewComponent], providers: [ExtendedSettingsService]
})
export class WvReportsModule { }
