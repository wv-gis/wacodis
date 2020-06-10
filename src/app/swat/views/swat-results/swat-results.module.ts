import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleNitrogenResultViewComponent } from '../nitrogen/single-nitrogen-result-view/single-nitrogen-result-view.component';
import { SingleResultViewComponent } from '../sediment/single-result-view/single-result-view.component';
import { HelgolandMapControlModule, HelgolandMapModule, HelgolandMapSelectorModule, HelgolandMapViewModule } from '@helgoland/map';
import { HelgolandCoreModule } from '@helgoland/core';
import { WvMapModule } from 'src/app/map/map.module';
import { ScenarioComparisonViewComponent } from '../sediment/scenario-comparison-view/scenario-comparison-view.component';
import { ScenarioComparisonNitrogenViewComponent } from '../nitrogen/scenario-comparison-nitrogen-view/scenario-comparison-nitrogen-view.component';



@NgModule({
  declarations: [SingleNitrogenResultViewComponent, SingleResultViewComponent,    ScenarioComparisonViewComponent,
    ScenarioComparisonNitrogenViewComponent],
  imports: [
    CommonModule,
    HelgolandCoreModule,
    HelgolandMapModule,
    HelgolandMapControlModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
    WvMapModule

  ],
  exports: [ SingleNitrogenResultViewComponent, SingleResultViewComponent,    ScenarioComparisonViewComponent,
    ScenarioComparisonNitrogenViewComponent]
})
export class SwatResultsModule { }
