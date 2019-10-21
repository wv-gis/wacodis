import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Timespan, LocalStorage, DatasetOptions } from '@helgoland/core';
import { Router } from '@angular/router';

@Component({
    selector: 'wv-timeshift-data-selector-menu',
    templateUrl: './timeshift-data-selector-menu.component.html',
    styleUrls: ['./timeshift-data-selector-menu.component.css']
})
export class TimeshiftDataSelectorMenuComponent {

    @Input()
    timespan: Timespan;

    @Input()
    datasetOptions: Map<string,DatasetOptions>;

    @Input()
    datasetIds: string[];

    @Output()
    onTimespanChanged: EventEmitter<Timespan> = new EventEmitter<Timespan>();

    public selectTime: string = 'today';
    constructor(private router: Router, private localStorage: LocalStorage) {
        if(localStorage.load('timeSelect')!== null){
            this.selectTime = localStorage.load('timeSelect') as string;
            this.checkSelected(this.selectTime);
        }
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
        this.selectTime = time;
        this.localStorage.save('timeSelect', this.selectTime);
        switch (time) {
            case 'day':
                if (diff == 100000000) {
                    break;
                }
                else {
                    const timespanDay = new Timespan(this.timespan.from - 100000000 + diff, this.timespan.to);
                    this.onTimespanChanged.emit(timespanDay);
                    break;
                }
            case 'week':
                if (diff == 604800000) {
                    break;
                } else {
                    const timespanWeek = new Timespan(this.timespan.from - 302400000 + diff, this.timespan.to + 302400000);
                    this.onTimespanChanged.emit(timespanWeek);
                    break
                }
            case 'today':
                const timespanTD = new Timespan(new Date().getTime() - 3600000 * (new Date().getHours() + 1), new Date().getTime() + (24 - new Date().getHours()) * 3600000);
                // console.log(new Date().getTime()-3600000*new Date().getHours());
                this.onTimespanChanged.emit(timespanTD);
                break;
            case 'half':{
                const timespanHalfY = new Timespan(this.timespan.from- 15770000000 +diff, this.timespan.to);
                this.onTimespanChanged.emit(timespanHalfY);
                break;
            }

        }
    }
public checkSelected(selected: string){
    if (this.selectTime == selected) {
        return true;
      }
      else {
        return false;
      }

}
}
