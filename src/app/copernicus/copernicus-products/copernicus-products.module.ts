import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandCoverComponent } from '../products/land-cover/land-cover.component';
import { ChlorophyllViewComponent } from '../products/chlorophyll-view/chlorophyll-view.component';
import { MowingViewComponent } from '../products/mowing-view/mowing-view.component';
import { SoilTemperatureViewComponent } from '../products/soil-temperature-view/soil-temperature-view.component';
import { VitalityViewComponent } from '../products/vitality-view/vitality-view.component';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandMapModule, HelgolandMapControlModule, HelgolandMapSelectorModule, HelgolandMapViewModule } from '@helgoland/map';
import { HelgolandOpenLayersModule } from '@helgoland/open-layers';
import { WvMapModule } from 'src/app/map/map.module';
import { SensorwappToolboxModule } from '@sensorwapp-toolbox/core';
import { LayerLegendCardComponent } from '../cards/layer-legend-card/layer-legend-card.component';
import { CopernicusBarChartCardComponent } from '../cards/copernicus-bar-chart-card/copernicus-bar-chart-card.component';
import { HelgolandD3Module } from '@helgoland/d3';
import { VitalityBarChartComponent } from '../cards/vitality-bar-chart/vitality-bar-chart.component';
import { VitalityPieChartComponent } from '../cards/vitality-pie-chart/vitality-pie-chart.component';
import { MixedDataChartComponent } from '../cards/mixed-data-chart/mixed-data-chart.component';
import { WvReportsModule } from 'src/app/reports/reports.module';


@NgModule({
  declarations: [LandCoverComponent, ChlorophyllViewComponent, MowingViewComponent, SoilTemperatureViewComponent,
    VitalityViewComponent, LayerLegendCardComponent,CopernicusBarChartCardComponent,VitalityBarChartComponent,VitalityPieChartComponent,MixedDataChartComponent],
  imports: [
    CommonModule,
    HelgolandCoreModule,
    HelgolandMapModule,
    HelgolandMapControlModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
    HelgolandOpenLayersModule,
    HelgolandD3Module,
    SensorwappToolboxModule,
    WvMapModule,
    WvReportsModule
  ],exports:[LandCoverComponent, ChlorophyllViewComponent, MowingViewComponent, SoilTemperatureViewComponent,
    VitalityViewComponent,  CopernicusBarChartCardComponent,VitalityBarChartComponent,VitalityPieChartComponent,LayerLegendCardComponent,MixedDataChartComponent]
})
export class CopernicusProductsModule { }
