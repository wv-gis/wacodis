import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Timespan } from "@helgoland/core";
import { Router } from "@angular/router";

@Component({
    selector: 'wv-depiction-menu',
    templateUrl: './depiction-menu.component.html',
    styleUrls: ['./depiction-menu.component.css']
})


export class DepictionMenuComponent {

@Input()
timespan: Timespan;

@Output()
onTimespanChanged: EventEmitter<Timespan> = new EventEmitter<Timespan>();
constructor(private router: Router){
    // this.timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());
}

timespanChanged(time: Timespan){
    this.onTimespanChanged.emit(time);
}
checkSelection(url: string){
    if (this.router.isActive(url, true)) {
        return true;
  
      }
      else {
        return false;
      }
}
}