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



@NgModule({
  declarations: [LandCoverComponent, ChlorophyllViewComponent, MowingViewComponent, SoilTemperatureViewComponent,
    VitalityViewComponent, LayerLegendCardComponent,CopernicusBarChartCardComponent],
  imports: [
    CommonModule,
    HelgolandCoreModule,
    HelgolandMapModule,
    HelgolandMapControlModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
    HelgolandOpenLayersModule,
    SensorwappToolboxModule,
    WvMapModule
  ],exports:[LandCoverComponent, ChlorophyllViewComponent, MowingViewComponent, SoilTemperatureViewComponent,
    VitalityViewComponent,  CopernicusBarChartCardComponent]
})
export class CopernicusProductsModule { }
