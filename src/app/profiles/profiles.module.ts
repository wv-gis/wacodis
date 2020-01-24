import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { CsvDataService } from 'src/app/settings/csvData.service';
import { ProfileEntryGraphComponent } from './profile-entry-graph/profile-entry-graph.component';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
import { HelgolandPlotlyModule } from '@helgoland/plotly';
import { ProfileDataViewSelectionComponent } from './data-selection/profile-data-view-selection/profile-data-view-selection.component';



@NgModule({
  imports: [
    CommonModule, HelgolandDatasetlistModule, HelgolandPlotlyModule
  ],
  declarations: [ProfileViewComponent, ProfileEntryGraphComponent, ProfileDataViewSelectionComponent], providers: [CsvDataService], exports: [ProfileViewComponent]
})
export class WvProfilesModule { }
