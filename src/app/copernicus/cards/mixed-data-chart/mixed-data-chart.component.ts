import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import * as Plotly from 'plotly.js-dist';
import { AdditionalData } from '@helgoland/d3/lib/extended-data-d3-timeseries-graph/extended-data-d3-timeseries-graph.component';

@Component({
  selector: 'wv-mixed-data-chart',
  templateUrl: './mixed-data-chart.component.html',
  styleUrls: ['./mixed-data-chart.component.css']
})
export class MixedDataChartComponent implements OnInit, AfterViewInit, OnChanges {


  /**
   * component to depict line and bar values together within a graph
   */
  @ViewChild('mixedChart', { static: true })
  public mixedChart: ElementRef;

  @Input() lineData: AdditionalData[];
  @Input() barChartId: string;
  @Input() drawChart: boolean = false;

  lineTimes: Date[] = [];
  lineValues: number[] = [];
  lineTimesTemp: Date[] = [];
  lineValuesTemp: number[] = [];
  barTimes: Date[] = [];
  barValues: number[] = [];

  constructor() { }

  ngOnInit() {

    this.prepareData();

  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.lineData) {
      if (!changes.lineData.firstChange) {
        console.log(this.lineData);
        this.lineData[0].data.forEach((v, n, array) => {
          this.lineTimes.push(new Date(v.timestamp));
          this.lineValues.push(v.value);
        });
        this.plotMixedChart();
      }
    }
  }

  // add graph after View Initialization
  ngAfterViewInit(): void {
    this.plotMixedChart();
  }


  /**
   * split values and change timestamp to date for line and bar value data
   */
  public prepareData() {
  
    this.lineData.forEach((dat,i,arr)=>{
      if(dat.datasetOptions.type=='line'){
        if(dat.datasetOptions.color=='orange'){
          dat.data.forEach((v, n, array) => {
            this.lineTimes.push(new Date(v.timestamp));
            this.lineValues.push(v.value);
          });
        }else{
          dat.data.forEach((v, n, array) => {
            this.lineTimesTemp.push(new Date(v.timestamp));
            this.lineValuesTemp.push(v.value);
          });
        }
     
      }else{
        dat.data.forEach((v, n, array) => {
          this.barTimes.push(new Date(v.timestamp));
          this.barValues.push(v.value);
        });
      }
    });

     
    
  }


  /**
   * define different types of plot data and the layout for the graph
   */
  plotMixedChart() {
 
    let data;
    if(this.lineData.length>2){
      data = [{
        type: "bar",
        x: this.barTimes,
        y: this.barValues,
        name: this.lineData[2].yaxisLabel
      },
      {
        type: "scatter",
        x: this.lineTimes,
        y: this.lineValues,
        name: this.lineData[0].yaxisLabel
      },
      {
        type: "scatter",
        x: this.lineTimesTemp,
        y: this.lineTimesTemp,
        name: this.lineData[1].yaxisLabel
      }];
    }else{
     data = [{
        type: "bar",
        x: this.barTimes,
        y: this.barValues,
        name: this.lineData[1].yaxisLabel
      },
      {
        type: "scatter",
        x: this.lineTimes,
        y: this.lineValues,
        name: this.lineData[0].yaxisLabel
      }];
    }

    var layout = {
      // width: 500,
      height: 300,
      margin: { "t": 20, "b": 40, "l": 40, "r": 5 },
      showlegend: true,
      yaxis: {
        zeroline: true,
        showline: true,
      },
      xaxis: {
        showgrid: true,
        showline: true,
      },
      legend: { "orientation": "h" }
    }
    var config = {
      locale: 'de',
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian',
        'hoverCompareCartesian', 'toggleSpikelines', 'pan2d', 'zoomOut2d', 'zoomIn2d', 'autoScale2d', 'resetScale2d'],
    }

    Plotly.newPlot(this.barChartId, data, layout, config);

  }
}
