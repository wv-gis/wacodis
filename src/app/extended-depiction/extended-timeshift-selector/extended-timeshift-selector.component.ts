import { Component, OnInit } from '@angular/core';
import { TimespanShiftSelectorComponent } from '@helgoland/time';
import { Time } from '@helgoland/core';

@Component({
  selector: 'wv-extended-timeshift-selector',
  templateUrl: './extended-timeshift-selector.component.html',
  styleUrls: ['./extended-timeshift-selector.component.scss']
})
export class ExtendedTimeshiftSelectorComponent extends TimespanShiftSelectorComponent implements OnInit {

  constructor(protected timeSrvc: Time) {
    super(timeSrvc);
   }

  ngOnInit() {
  }

}
