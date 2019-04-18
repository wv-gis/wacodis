import { Component, OnInit } from '@angular/core';
import { TimespanShiftSelectorComponent } from '@helgoland/time';
import { Time } from '@helgoland/core';

@Component({
  selector: 'wv-extended-timeshift-selector',
  templateUrl: './wv-extended-timeshift-selector.component.html',
  styleUrls: ['./wv-extended-timeshift-selector.component.css']
})
export class WvExtendedTimeshiftSelectorComponent extends TimespanShiftSelectorComponent {

  constructor(protected timeSrvc: Time) {
    super(timeSrvc);
   }

  
}
