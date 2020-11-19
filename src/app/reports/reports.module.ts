import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsViewComponent } from './reports-view/reports-view.component';
import { HelgolandD3Module } from '@helgoland/d3';
import { ExtendedSettingsService } from 'src/app/settings/settings.service';
import { SelectionViewComponent } from './selection/selection-view/selection-view.component';
import { WvProfilesModule } from '../profiles/profiles.module';
import { IsoplethenViewComponent } from './isoplethen/isoplethen-view/isoplethen-view.component';
import { SensorwappToolboxModule } from '@sensorwapp-toolbox/core';
import { IsoplethenGraphicComponent } from './isoplethen/isoplethen-graphic/isoplethen-graphic.component';

@NgModule({
  imports: [
    CommonModule,
    HelgolandD3Module,
    SensorwappToolboxModule,
    WvProfilesModule
  ],
  declarations: [ReportsViewComponent, SelectionViewComponent, IsoplethenViewComponent, IsoplethenGraphicComponent], providers: [ExtendedSettingsService],
  exports: [IsoplethenGraphicComponent]
})
export class WvReportsModule { }
