import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparisonViewComponent } from '../change-detection/view/comparison-view/comparison-view.component';
import { MenuBarComponent } from './menu/menu-bar/menu-bar.component';
import { ComparisonSelectionViewComponent } from './view/comparison-selection-view/comparison-selection-view.component';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandMapModule, HelgolandMapControlModule, HelgolandMapSelectorModule, HelgolandMapViewModule } from '@helgoland/map';
import { ActivatedRoute } from '@angular/router';
import { ComparisonSelectionService } from 'src/app/services/comparison-selection.service';

@NgModule({
  imports: [
    CommonModule,
    HelgolandCoreModule,
    HelgolandMapModule,
    HelgolandMapControlModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
  ],
  declarations: [ComparisonViewComponent, MenuBarComponent, ComparisonSelectionViewComponent],
  providers: [ComparisonSelectionService]
})
export class WvChangeDetectionModule { }
