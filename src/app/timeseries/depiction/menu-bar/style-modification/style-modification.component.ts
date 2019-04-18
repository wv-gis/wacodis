import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { MinMaxRange, DatasetOptions } from '@helgoland/core';




@Component({
  selector: 'wv-style-modification',
  templateUrl: './style-modification.component.html',
  styleUrls: ['./style-modification.component.css']
})
export class StyleModificationComponent implements OnInit {
  public selColor: string;
  public colorList: string [];
  public generalize: boolean;
  public zeroBasedYAxis: boolean;
  public autoRangeSelection: boolean;
  public separateYAxis: boolean;
  public pointRadius: number;
  public lineWidth: number;
  public range: MinMaxRange;
  @Input() visible: string;
  @Input() option: DatasetOptions;
  @Output() 
  updatedOptionsEmit: EventEmitter<DatasetOptions> = new EventEmitter<DatasetOptions>();

  constructor() {
    this.colorList = ['#FF0000', '#00FF00', '#0000FF'];
 
   }

  ngOnInit() {
    if(this.option!= undefined){
      this.generalize = this.option.generalize;
      this.zeroBasedYAxis = this.option.zeroBasedYAxis;
      this.autoRangeSelection = this.option.autoRangeSelection;
      this.pointRadius = this.option.pointRadius;
      this.lineWidth = this.option.lineWidth;
      this.range = this.option.yAxisRange;
      this.separateYAxis = this.option.separateYAxis;
    }
    // this.separateYAxis = this.option.separateYAxis;
  }
  public updateRange(range: MinMaxRange) {
    this.range = range;
    if (this.selColor) { this.option.color = this.selColor; }
        this.option.generalize = this.generalize;
        this.option.zeroBasedYAxis = this.zeroBasedYAxis;
        this.option.autoRangeSelection = this.autoRangeSelection;
        this.option.lineWidth = this.lineWidth;
        this.option.pointRadius = this.pointRadius;
        this.option.yAxisRange = this.range;
        this.option.separateYAxis = this.separateYAxis;
        this.updatedOptionsEmit.emit(this.option);
  }
public updateYAxis(){
  this.separateYAxis = !this.separateYAxis;
  this.option.generalize = this.generalize;
  this.option.zeroBasedYAxis = this.zeroBasedYAxis;
  this.option.autoRangeSelection = this.autoRangeSelection;
  this.option.lineWidth = this.lineWidth;
  this.option.pointRadius = this.pointRadius;
  this.option.yAxisRange = this.range;
  this.option.separateYAxis = this.separateYAxis;
  console.log('After: ' + this.separateYAxis + ' options: ' + this.option.separateYAxis);
  this.updatedOptionsEmit.emit(this.option);
}
  public setColor(temp) {
    this.selColor = temp;
    this.option.color = this.selColor;
    this.option.generalize = this.generalize;
    this.option.zeroBasedYAxis = this.zeroBasedYAxis;
    this.option.autoRangeSelection = this.autoRangeSelection;
    this.option.lineWidth = this.lineWidth;
    this.option.pointRadius = this.pointRadius;
    this.option.yAxisRange = this.range;
    this.option.separateYAxis = this.separateYAxis;
    // this.updatedColorEmit.emit(this.selColor);
    this.updatedOptionsEmit.emit(this.option);
  }
}
