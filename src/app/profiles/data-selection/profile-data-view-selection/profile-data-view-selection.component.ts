import { Component, OnInit } from '@angular/core';
import { DatasetService, TimedDatasetOptions, SettingsService, Settings, Provider, IDataset, Platform } from '@helgoland/core';
import { ProfilesEntryService } from 'src/app/services/profiles-entry.service';
import { ListSelectorParameter } from '@helgoland/selector';
import { Router } from '@angular/router';

@Component({
  selector: 'wv-profile-data-view-selection',
  templateUrl: './profile-data-view-selection.component.html',
  styleUrls: ['./profile-data-view-selection.component.css']
})
export class ProfileDataViewSelectionComponent implements OnInit {

  public categoryParams: ListSelectorParameter[] = [{
    type: 'category',
    header: 'Kategorie',
  }, 
  {
    type: 'offering',
    header: 'Offering',

  },
  {
    type: 'phenomenon',
    header: 'Phänomen',

  },
  {
    type: 'procedure',
    header: 'Prozedur',
  },

];

public selectedProviderList: Provider[] = [];

  constructor(private profileDataService: ProfilesEntryService, private settings: SettingsService<Settings>, private router: Router) { 

    this.selectedProviderList.push({
      id: settings.getSettings().datasetApis[4].name,
      url: settings.getSettings().datasetApis[4].url
    });
  }

  ngOnInit() {
  }

  public onDatasetSelected(data: Platform, options?: TimedDatasetOptions[]){
    console.log(data.datasets + ' ID: ' + data.id);
    // this.profileDataService.addDataset(data.internalId, options);
    this.router.navigateByUrl('/profiles-diagram');
  }
}
