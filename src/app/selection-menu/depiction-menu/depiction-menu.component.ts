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
    constructor(private router: Router) {

    }

    timespanChanged(time: Timespan) {
        this.onTimespanChanged.emit(time);
    }
    checkSelection(url: string) {
        if (this.router.isActive(url, true)) {
            return true;

        }
        else {
            return false;
        }
    }
    public setTimespan(time: string) {
        const diff = this.timespan.to - this.timespan.from;
        switch (time) {
            case 'day':

            console.log(diff);
            if(diff == 100000000){
                break;
            }
            else{
                const timespanDay = new Timespan(this.timespan.from - 100000000 + diff, this.timespan.to);
                this.onTimespanChanged.emit(timespanDay);
                break;
            }
            case 'week':
            if(diff == 604800000){
                break;
            }else{
                const timespanWeek = new Timespan(this.timespan.from - 302400000 + diff, this.timespan.to + 302400000);
                this.onTimespanChanged.emit(timespanWeek);
                break;
            }
                
        }
    }
}