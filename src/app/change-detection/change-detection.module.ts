import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparisonViewComponent } from '../change-detection/view/comparison-view/comparison-view.component';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandMapModule, HelgolandMapControlModule, HelgolandMapSelectorModule, HelgolandMapViewModule } from '@helgoland/map';
import { ActivatedRoute } from '@angular/router';
import { WvMapModule } from '../map/map.module';

@NgModule({
  imports: [
    CommonModule,
    HelgolandCoreModule,
    HelgolandMapModule,
    HelgolandMapControlModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
    WvMapModule
  ],
  declarations: [ComparisonViewComponent],
  providers: []
})
export class WvChangeDetectionModule { }
