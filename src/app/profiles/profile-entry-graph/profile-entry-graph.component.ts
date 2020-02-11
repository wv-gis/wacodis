import { Component, OnInit } from '@angular/core';
import { TimedDatasetOptions, DatasetService } from '@helgoland/core';
import { ProfilesEntryService } from 'src/app/services/profiles-entry.service';

@Component({
  selector: 'wv-profile-entry-graph',
  templateUrl: './profile-entry-graph.component.html',
  styleUrls: ['./profile-entry-graph.component.scss']
})
export class ProfileEntryGraphComponent implements OnInit {


  public ids = ['http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity-profile_12', 'http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity-profile_10'];
  // public id = 'http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity-profile_12';
  public datasetOptions: TimedDatasetOptions[] = [];
  public profileDatasetOptions: Map<string, TimedDatasetOptions[]> = new Map();
  public isActive = true;
  protected selectedIds: Array<string> = [];
  protected reloadedDataset: string[] = [];

  constructor(private profileDataService: ProfilesEntryService) {
    // this.ids.forEach((entry) => {
    //   this.profileDatasetOptions.set(entry, [new TimedDatasetOptions(entry, '#00FF00', 1491178657000)]);
    // });

    if (profileDataService !== undefined && profileDataService.hasDatasets()) {
    //  profileDataService.datasetIds.forEach((id)=> this.ids.push(id));
     this.profileDatasetOptions = profileDataService.datasetOptions;
    }
  }

  ngOnInit() {
  }
  public updateOptions(options: TimedDatasetOptions[], id: string) {
  console.log(JSON.stringify(options));
      this.profileDataService.updateDatasetOptions(options, id);
    

  }

  public deleteProfileOptions(option: TimedDatasetOptions, id: string) {
    // this.profileDatasetOptions.delete(id);
    this.profileDataService.removeDataset(id);
  }

  public selectProfile(selected: boolean, id: string) {
    if (selected) {
      this.selectedIds.push(id);
    } else {
      this.selectedIds.splice(this.selectedIds.findIndex(e => e === id), 1);
    }

  }

  public isSelected(internalId: string) {
    return this.selectedIds.find(e => e === internalId);
}
  public editOption(option: TimedDatasetOptions) {
    console.log('edit options');

  }

  public openCombiView(option: TimedDatasetOptions) {
    console.log('open in combi view');
  }

  public showGeometry(geometry: GeoJSON.GeometryObject) {
    console.log('show geometry-type: ');
    console.dir(geometry);
  }

  public groupYaxisChanged(id: string) {
    this.profileDatasetOptions.get(id).forEach((opt) => opt.separateYAxis = !opt.separateYAxis)
  }
  change() {
    if (this.isActive) {
      this.isActive = !this.isActive;
      return false;
    }
    else {
      this.isActive = !this.isActive;
      return true;
    }
  }
  refreshData() { }

  showAllStations() { }

}
