import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleResultViewComponent } from '../sediment/single-result-view/single-result-view.component';
import { HelgolandMapControlModule, HelgolandMapModule, HelgolandMapSelectorModule, HelgolandMapViewModule } from '@helgoland/map';
import { HelgolandCoreModule } from '@helgoland/core';
import { WvMapModule } from 'src/app/map/map.module';
import { ScenarioComparisonViewComponent } from '../sediment/scenario-comparison-view/scenario-comparison-view.component';
import { TSBarChartComponent } from './tsbar-chart/tsbar-chart.component';
import { CopernicusProductsModule } from 'src/app/copernicus/copernicus-products/copernicus-products.module';
import { HelgolandOpenLayersModule } from '@helgoland/open-layers';
import { PercentageChangeBarChartComponent } from './percentage-change-bar-chart/percentage-change-bar-chart.component';



@NgModule({
  declarations: [ SingleResultViewComponent,    ScenarioComparisonViewComponent,
    
    TSBarChartComponent,
    PercentageChangeBarChartComponent],
  imports: [
    CommonModule,
    HelgolandCoreModule,
    HelgolandMapModule,
    HelgolandMapControlModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
    HelgolandOpenLayersModule,
    WvMapModule,
    CopernicusProductsModule

  ],
  exports: [  SingleResultViewComponent,    ScenarioComparisonViewComponent,
    ]
})
export class SwatResultsModule { }
