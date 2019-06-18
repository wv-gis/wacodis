import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsViewComponent } from './reports-view/reports-view.component';
import { HelgolandD3Module } from '@helgoland/d3';
import { ExtendedSettingsService } from 'src/app/settings/settings.service';

@NgModule({
  imports: [
    CommonModule,
    HelgolandD3Module,
  ],
  declarations: [ReportsViewComponent], providers: [ExtendedSettingsService]
})
export class WvReportsModule { }
