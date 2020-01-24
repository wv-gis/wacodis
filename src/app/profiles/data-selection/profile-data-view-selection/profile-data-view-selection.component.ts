import { Component, OnInit } from '@angular/core';
import { DatasetService, TimedDatasetOptions } from '@helgoland/core';

@Component({
  selector: 'wv-profile-data-view-selection',
  templateUrl: './profile-data-view-selection.component.html',
  styleUrls: ['./profile-data-view-selection.component.css']
})
export class ProfileDataViewSelectionComponent implements OnInit {

  constructor(private dataService: DatasetService<TimedDatasetOptions>) { }

  ngOnInit() {
  }

}
