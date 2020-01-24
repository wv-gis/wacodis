import { Component, OnInit } from '@angular/core';
import { TimedDatasetOptions, DatasetService } from '@helgoland/core';

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

  constructor(profileDataService: DatasetService<TimedDatasetOptions>) {
    this.ids.forEach((entry) => {
      this.profileDatasetOptions.set(entry, [new TimedDatasetOptions(entry, '#00FF00', 1491178657000)]);
      this.datasetOptions.push(new TimedDatasetOptions(entry, '#00FF00', 1491178657000));
    });
    // if (profileDataService !== undefined && profileDataService.hasDatasets()) {
    //   for (let k = 0; k < profileDataService.datasetIds.length; k++) {
    //     this.ids.push(profileDataService.datasetIds[k]);
    //   }
    //   try {
    //     profileDataService.datasetOptions.forEach((options) => {
    //       this.ids.forEach((entry, i) => {
    //         this.profileDatasetOptions.set(entry, [options]);
    //         this.datasetOptions.push(options[i]);
    //       });
    //     });
    //   } catch (e) {
    //     console.log('Error in TimeseriesView ' + e);
    //   }
    // }
  }

  ngOnInit() {
  }
  public updateOptions(options: TimedDatasetOptions[], id: number) {
    console.log('update options');
    options.forEach(element => {
      element.visible = false;
    });

  }

  public deleteProfileOptions(option: TimedDatasetOptions, id: number) {
    console.log('delete options');
  }

  public selectProfile(selected: boolean, id: string) {
    this.datasetOptions.forEach((value, i, arr) => {
      if (value.internalId === id)
        arr[i].lineWidth == 4;
    });
    console.log(id + ' selected: ' + selected);
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

  public groupYaxisChanged() {
    this.datasetOptions.forEach((opt) => opt.separateYAxis = !opt.separateYAxis)
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
