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



@NgModule({
  declarations: [LandCoverComponent, ChlorophyllViewComponent, MowingViewComponent, SoilTemperatureViewComponent,VitalityViewComponent],
  imports: [
    CommonModule,
    HelgolandCoreModule,
    HelgolandMapModule,
    HelgolandMapControlModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
    HelgolandOpenLayersModule,
    WvMapModule
  ],exports:[LandCoverComponent, ChlorophyllViewComponent, MowingViewComponent, SoilTemperatureViewComponent,VitalityViewComponent]
})
export class CopernicusProductsModule { }
