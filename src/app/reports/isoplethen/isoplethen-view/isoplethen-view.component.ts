import { Component, OnInit } from '@angular/core';
import { Timespan } from '@helgoland/core';

@Component({
  selector: 'wv-isoplethen-view',
  templateUrl: './isoplethen-view.component.html',
  styleUrls: ['./isoplethen-view.component.css']
})
export class IsoplethenViewComponent implements OnInit {
  timeSpan = new Timespan(new Date(2017,12,1).getTime(), new Date(2018,11,28).getTime());
  samplingId = '1223';
  
  constructor() { }

  ngOnInit() {
  }

}
