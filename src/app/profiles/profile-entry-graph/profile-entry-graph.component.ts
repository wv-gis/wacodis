import { Component, OnInit } from '@angular/core';
import { TimedDatasetOptions } from '@helgoland/core';
import { ProfilesEntryService } from 'src/app/services/profiles-entry.service';

@Component({
  selector: 'wv-profile-entry-graph',
  templateUrl: './profile-entry-graph.component.html',
  styleUrls: ['./profile-entry-graph.component.scss']
})
/**
 * component for legend entries of Profile Datasets
 */
export class ProfileEntryGraphComponent implements OnInit {


  public ids = ['http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity-profile_12', 'http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity-profile_10'];
  public datasetOptions: TimedDatasetOptions[] = [];
  public profileDatasetOptions: Map<string, TimedDatasetOptions[]> = new Map();
  public isActive = true;
  public selectedIds: Array<string> = [];
  public reloadedDataset: string[] = [];

  constructor(private profileDataService: ProfilesEntryService) {
  
    if (profileDataService !== undefined && profileDataService.hasDatasets()) {
     this.profileDatasetOptions = profileDataService.datasetOptions;
    }
  }

  ngOnInit() {
  }

  public updateOptions(options: TimedDatasetOptions[], id: string) {
  console.log(JSON.stringify(options));
      this.profileDataService.updateDatasetOptions(options, id);
      }

      /**
       * delete selectd Profile
       * @param option selected TimedDatasetOptions
       * @param id selected ID of Dataset
       */
  public deleteProfileOptions(option: TimedDatasetOptions, id: string) {
    this.profileDataService.removeDataset(id);
  }

/**
 * highlight or cncel highlighting of  selected Profile
 * @param selected wether the profile is selected or unselectd
 * @param id id of selected Profile
 */
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

/**
 * edit profile Options
 * @param option profile Options to edit
 */
  public editOption(option: TimedDatasetOptions) {
    console.log('edit options');

  }
/**
 * open combined View of Profile
 * @param option 
 */
  public openCombiView(option: TimedDatasetOptions) {
    console.log('open in combi view');
  }

  /**
   * show geometry on map for localization
   * @param geometry geometry of profile Object
   */
  public showGeometry(geometry: GeoJSON.GeometryObject) {
    console.log('show geometry-type: ');
    console.dir(geometry);
  }

  /**
   * change grouping of yaxis
   * @param id 
   */
  public groupYaxisChanged(id: string) {
    this.profileDatasetOptions.get(id).forEach((opt) => opt.separateYAxis = !opt.separateYAxis)
  }

  /**
   * open and close profile dataset tree
   */
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
