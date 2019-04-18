import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { CsvDataService } from 'src/app/settings/csvData.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ProfileViewComponent], providers: [CsvDataService]
})
export class WvProfilesModule { }
