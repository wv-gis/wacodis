import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { CsvDataService } from 'src/app/settings/csvData.service';
import { ProfileEntryGraphComponent } from './profile-entry-graph/profile-entry-graph.component';
import { HelgolandDatasetlistModule, HelgolandLabelMapperModule } from '@helgoland/depiction';
import { HelgolandPlotlyModule } from '@helgoland/plotly';
import { ProfileDataViewSelectionComponent } from './data-selection/profile-data-view-selection/profile-data-view-selection.component';
import { CustomProfileEntryComponent } from './customized/custom-profile-entry/custom-profile-entry.component';
import { ProfilesEntryService } from '../services/profiles-entry.service';
import { CustomPlotlyProfileGraphComponent } from './customized/custom-plotly-profile-graph/custom-plotly-profile-graph.component';
import { HelgolandSelectorModule } from '@helgoland/selector';



@NgModule({
  imports: [
    CommonModule, HelgolandDatasetlistModule, HelgolandPlotlyModule, HelgolandLabelMapperModule,HelgolandSelectorModule
  ],
  declarations: [ProfileViewComponent, ProfileEntryGraphComponent, ProfileDataViewSelectionComponent, CustomProfileEntryComponent, CustomPlotlyProfileGraphComponent], providers: [CsvDataService, ProfilesEntryService], exports: [ProfileViewComponent]
})
export class WvProfilesModule { }
