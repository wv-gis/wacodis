import { Component, OnInit, Input } from '@angular/core';
import { FacetSearchService } from '@helgoland/facet-search';
import { Timespan } from '@helgoland/core';
import moment, { Duration } from 'moment';


export interface StepDefinition{
  value:number,
}

/**
 * Component to select timeseries data by time
 */
@Component({
  selector: 'wv-time-slider',
  templateUrl: './time-slider.component.html',
  styleUrls: ['./time-slider.component.css']
})
export class WvTimeSliderComponent implements OnInit {

  @Input() public facetSearchService: FacetSearchService;
  public minVal: number;
  public maxVal: number;
  public slider: HTMLInputElement;
  

  constructor() { }


  /**
   * set selected timespan and parameters based on default selection
   */
  ngOnInit() {
    this.slider = <HTMLInputElement>document.getElementById("myRange");
    this.facetSearchService.getResults().subscribe(() => this.fetchTime());
   }

  /**
   * update time values based on selection to update parameter list
   */
  public updateTime() {
    const timespan = new Timespan(this.minVal, this.maxVal);
    this.facetSearchService.setSelectedTimespan(timespan);
  }


  /**
   * get selected timespan
   */
  private fetchTime() {
    // this.supportsTimefilter = false;
    const completeTs = this.facetSearchService.getCompleteTimespan();
    if (completeTs) {
      // this.supportsTimefilter = true;
      const duration = this.findDuration(completeTs);
      const timestops = this.getTimeStops(completeTs, duration);
      const currentTs = this.facetSearchService.getFilteredTimespan();
      if (currentTs) {
        this.minVal = currentTs.from;
        this.maxVal = currentTs.to;
      } else {
        this.minVal = completeTs.from;
        this.maxVal = completeTs.to;
      }
      if (timestops) {
        this.slider.step = (timestops[1].value - timestops[0].value).toString();
    
      }
    }
  }

  /**
   * receive the timestops within the time filter which define the timespan to plot
   * @param timespan 
   * @param duration 
   */
  private getTimeStops(timespan: Timespan, duration: Duration): StepDefinition[] {
    if (timespan) {
      const startTime = moment(timespan.from);
      const endTime = moment(timespan.to);

      if (endTime.isBefore(startTime)) {
        endTime.add(1, 'day');
      }
      const timeStops: StepDefinition[] = [{ value: startTime.valueOf() }];

      do {
        startTime.add(duration);
        timeStops.push({ value: startTime.valueOf() });
      } while (startTime <= endTime);

      return timeStops;
    }
  }

  /**
   * find Duration of selected timespan
   * @param timespan 
   */
  private findDuration(timespan: Timespan) {
    if (timespan) {
      const diff = timespan.to - timespan.from;
      if (diff > moment.duration(20, 'years').asMilliseconds()) {
        return moment.duration(6, 'months');
      }
    }
    return moment.duration(1, 'months');
  }
}
