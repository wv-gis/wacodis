import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, AfterViewInit } from '@angular/core';
import { Timespan, ApiV3InterfaceService } from '@helgoland/core';
import { IsoplethenDatasetSchema } from '@sensorwapp-toolbox/core/lib/models/IsoplethenDatasetSchema.model';

import Plotly from 'plotly.js-dist';
import * as d3 from 'd3';
import { locale } from 'src/environments/environment';

const width = 1040;
const height = 750;
@Component({
  selector: 'wv-isoplethen-graphic',
  templateUrl: './isoplethen-graphic.component.html',
  styleUrls: ['./isoplethen-graphic.component.css']
})
export class IsoplethenGraphicComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() autocontourValue: boolean = false;
  @Input() numIso: number = 15;// number of isolines
  @Input() distIso: number = 1;// distance between isolines
  @Input() colorscale: any[] = this.setDefaultColorScale();
  @Input() timespan: Timespan;
  @Input() datasetID: string;
  @Input() interp: string = 'linear';
  // @Input() dataset: ApiV3Dataset;

  @ViewChild('swappChart', { static: false }) swappChart: ElementRef;

  private start_iso = 1;
  private end_iso = this.numIso;
  measureDates: Date[] = [];
  maxDepth: number[] = [];
  private reversedColor = false;
  plot: any;
  samplings_Dataset: IsoplethenDatasetSchema[] = [];
  measureParam: string;
  year: number;
  damLabel: string = '';
  maxDamDepth: string;
  public depths = [0, 3, 7, 12, 16, 20, 22, 26, 28, 29, 33, 36, 39, 42, 0, 3, 6, 9, 12,
    15, 16, 17, 20, 23, 29, 34, 40, 45, 0, 4, 8, 12, 17, 22, 23,
    21, 29, 33, 34, 35, 40, 44, 45, 0, 2, 4, 8, 10, 13, 18, 28, 30, 36, 40, 44, 45, 47, 0, 3, 6, 9,
    12, 16, 20, 25, 26, 31, 33, 38, 40, 45, 0, 4, 5, 6, 7, 7.,
    9, 13, 20, 25, 30, 35, 40, 45, 0, 2, 4, 7, 10, 14, 15, 16, 17, 21,
    24, 36, 41, 44, 0, 3, 6, 8, 10, 12, 14, 17, 18, 20, 30, 35,
    40, 44, 0, 4, 7, 9, 12, 13, 14, 15, 16, 17, 18, 21, 27, 41,
    0, 2, 4, 8, 10, 12, 14, 16, 20, 24, 28, 30, 35, 39, 0, 3,
    5, 8, 11, 12, 16, 17, 19, 20, 22, 28, 34, 39, 0, 3, 6,
    8, 10, 12, 14, 16, 18, 20, 25, 31, 34, 37, 0, 3, 6, 8, 9,
    10, 12, 15, 20, 23, 26, 29, 32, 35];

  public vals = [11.7, 11.7, 11.7, 11.7, 11.7, 11.7, 11.7, 11.7, 11.7, 11.7, 11.7, 11.7, 11.7,
    11.0, 12.3, 12.3, 12.3, 12.3, 12.3, 12.2, 12.2, 12.2, 12.2, 12.2, 12.2, 12.2, 12.2, 12.2,
    13.1, 13.1, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0,
    13.4, 13.6, 13.9, 13.7, 13.6, 13.5, 13.4, 13.3, 13.3, 13.3, 13.2, 13.2, 13.2, 13.2, 11.1,
    11.9, 12.4, 12.8, 12.8, 12.3, 12.1, 12.1, 12.1, 12.0, 12.0, 12.0, 12.0, 11.6, 9.9, 10.2,
    12.0, 13.0, 13.4, 13.1, 13.3, 12.7, 11.8, 11.8, 11.8, 11.8, 10.8, 6.0, 9.9, 10.0, 10.0,
    11.1, 11.8, 12.3, 13.0, 12.1, 11.7, 10.9, 10.9, 11.0, 9.4, 6.4, 9.4, 9.5, 10.7, 13.6,
    11.9, 11.6, 11.7, 13.5, 11.5, 10.5, 10.2, 10.4, 8.2, 4.1, 10.0, 10.0, 10.1, 10.5, 10.1,
    10.5, 10.7, 10.8, 11.7, 12.4, 12.4, 9.5, 9.2, 7.4, 10.1, 10.1, 10.0, 10.0, 8.8, 8.3,
    8.4, 9.6, 9.8, 8.3, 7.5, 7.5, 7.7, 7.3, 10.4, 10.4, 10.4, 10.5, 9.1, 7.4, 8.1,
    8.4, 9.3, 9.4, 8.8, 7.6, 7.2, 6.2, 10.2, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1,
    7.8, 7.6, 7.2, 6.4, 6.0, 4.9, 10.2, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1,
    10.1, 10.2, 10.2, 10.1, 9.4];

  public date = [
    1484568000000, 1484568000000, 1484568000000, 1484568000000, 1484568000000, 1484568000000, 1484568000000, 1484568000000,
    1484568000000, 1484568000000, 1484568000000, 1484568000000, 1484568000000, 1484568000000, 1487505600000, 1487505600000,
    1487505600000, 1487505600000, 1487505600000, 1487505600000, 1487505600000, 1487505600000, 1487505600000, 1487505600000,
    1487505600000, 1487505600000, 1487505600000, 1487505600000, 1490011200000, 1490011200000, 1490011200000, 1490011200000,
    1490011200000, 1490011200000, 1490011200000, 1490011200000, 1490011200000, 1490011200000, 1490011200000, 1490011200000,
    1490011200000, 1490011200000, 1490011200000, 1491825600000, 1491825600000, 1491825600000, 1491825600000, 1491825600000,
    1491825600000, 1491825600000, 1491825600000, 1491825600000, 1491825600000, 1491825600000, 1491825600000, 1491825600000,
    1491825600000, 1494244800000, 1494244800000, 1494244800000, 1494244800000, 1494244800000, 1494244800000, 1494244800000,
    1494244800000, 1494244800000, 1494244800000, 1494244800000, 1494244800000, 1494244800000, 1494244800000, 1496664000000,
    1496664000000, 1496664000000, 1496664000000, 1496664000000, 1496664000000, 1496664000000, 1496664000000, 1496664000000,
    1496664000000, 1496664000000, 1496664000000, 1496664000000, 1496664000000, 1499083200000, 1499083200000, 1499083200000,
    1499083200000, 1499083200000, 1499083200000, 1499083200000, 1499083200000, 1499083200000, 1499083200000, 1499083200000,
    1499083200000, 1499083200000, 1499083200000, 1501502400000, 1501502400000, 1501502400000, 1501502400000, 1501502400000,
    1501502400000, 1501502400000, 1501502400000, 1501502400000, 1501502400000, 1501502400000, 1501502400000, 1501502400000,
    1501502400000, 1503835200000, 1503835200000, 1503835200000, 1503835200000, 1503835200000, 1503835200000, 1503835200000,
    1503835200000, 1503835200000, 1503835200000, 1503835200000, 1503835200000, 1503835200000, 1503835200000, 1506254400000,
    1506254400000, 1506254400000, 1506254400000, 1506254400000, 1506254400000, 1506254400000, 1506254400000, 1506254400000,
    1506254400000, 1506254400000, 1506254400000, 1506254400000, 1506254400000, 1508241600000, 1508241600000, 1508241600000,
    1508241600000, 1508241600000, 1508241600000, 1508241600000, 1508241600000, 1508241600000, 1508241600000, 1508241600000,
    1508241600000, 1508241600000, 1508241600000, 1511092800000, 1511092800000, 1511092800000, 1511092800000, 1511092800000,
    1511092800000, 1511092800000, 1511092800000, 1511092800000, 1511092800000, 1511092800000, 1511092800000, 1511092800000,
    1511092800000, 1513598400000, 1513598400000, 1513598400000, 1513598400000, 1513598400000, 1513598400000, 1513598400000,
    1513598400000, 1513598400000, 1513598400000, 1513598400000, 1513598400000, 1513598400000, 1513598400000];

  private setDefaultColorScale(): any[] {
    return [[0, 'rgb(230,25,75)'], [0.25, 'rgb(255,255,0)'], [0.45, 'rgb(0,255,0)'],
    [0.65, 'rgb(0,255,216)'], [0.85, 'rgb(51,102,255)'], [1, 'rgb(0,51,255)']];
  }

  constructor(
    private swappApi: ApiV3InterfaceService,

  ) { }

  ngAfterViewInit(): void {
    // this.createProfileViews();
  }

  ngOnInit(): void {
    Plotly.register(locale);
    // const serviceId: string =" this.dsUtils.getServiceId(this.dataset);";
    // const timespan =" this.dsUtils.timespanToIsoPeriod(this.timespan);";
     this.receiveDatasets();


    // this.measureParam = 'Sauerstoff xy';
    // this.damLabel = 'Dhünn';
    // this.year = new Date(2017, 0, 1).getFullYear();


  }

  receiveDatasets() {
    this.swappApi.getDataset(this.datasetID, "http://192.168.101.105/sos3/api/").subscribe((dataset) => {
      console.log(dataset);
      this.swappApi.getDatasetData(dataset.id, dataset.internalId.split('__')[0], { timespan: new Date(this.timespan.from).toISOString() + '/' + new Date(this.timespan.to).toISOString() })
        .subscribe(
          (values: any) => this.prepareDatasets(values),
          (error: any) => console.log(error),
          () => this.createProfileViews());

      this.measureParam = dataset.parameters.phenomenon.label + ' ' + dataset.uom;
      this.damLabel = dataset.feature.properties.label;
      this.year = new Date(this.timespan.from).getFullYear();
    });
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.distIso) {
      if (!changes.distIso.firstChange) {
        this.createProfileViews();
      }

    }
    else if (changes.numIso) {
      if (!changes.numIso.firstChange) {
        this.createProfileViews();
      }
    }
 else if(changes.interp){
      if(!changes.interp.firstChange){
        this.createProfileViews();
      }
    }
    if (changes.datasetID) {
      if (!changes.datasetID.firstChange) {
        this.samplings_Dataset = [];
        this.maxDepth = [];
        this.measureDates = [];
        this.receiveDatasets();
      }
    }
  }


  private prepareDatasets(observations: any) {
    for (let p = 0; p < observations.values.length; p++) {
      for (let k = 0; k < observations.values[p].value.length; k++) {
        this.samplings_Dataset.push({
          date: new Date(observations.values[p].timestamp),
          depth: observations.values[p].value[k].vertical,
          value: observations.values[p].value[k].value,
        });
        if (p > 0 && new Date(observations.values[p].timestamp).getTime() >
          new Date(observations.values[p - 1].timestamp).getTime()) {
          this.maxDepth.push(observations.values[p - 1].value[observations.values[p - 1].value.length - 1].vertical);
          this.measureDates.push(new Date(observations.values[p - 1].timestamp));
        }
      }
    }
    let length = observations.values.length;
    if (length > 0) {
      this.maxDepth.push(observations.values[length - 1].value[observations.values[length - 1].value.length - 1].vertical);
      this.measureDates.push(new Date(observations.values[length - 1].timestamp));
    }
  }

  createProfileViews() {
    if (this.plot != undefined) {
      Plotly.purge(this.swappChart.nativeElement);
          //  Plotly.purge("swappChart");
    }

    let x_dates = [], y_depths = [], z_value = [];

    for (let q = 0; q < this.samplings_Dataset.length; q++) {
      x_dates.push(this.samplings_Dataset[q].date);
      y_depths.push(this.samplings_Dataset[q].depth);
      z_value.push(this.samplings_Dataset[q].value); 
    }

    // for (let q = 0; q < this.vals.length; q++) {
    //   x_dates.push(new Date(this.date[q]));
    //   y_depths.push(this.depths[q]);
    //   z_value.push(this.vals[q]);

    // }
 
    if (!this.interp.includes('linear')) {
      let testDel = this.calculateDelaunayTriang(x_dates, y_depths, z_value);
      for (let q = 0; q < testDel.length; q++) {
      x_dates.push(testDel[q].date);
      y_depths.push(testDel[q].depth);
      z_value.push(testDel[q].value);
      }
    }
    else {
      // interpolation of the dataset
      let coord = [];
      let dataArray = [x_dates, y_depths, z_value];

      for (let set in x_dates) {
        coord.push([x_dates[set], y_depths[set], z_value[set]]);
      }

      let interpolatorArray = [];
      for (let i = 0, k = 1; i < coord.length; i++ , k++) {
        interpolatorArray.push(d3.interpolateObject(coord[i], [dataArray[0][k], dataArray[1][k], dataArray[2][k]]));
      }
      for (let j = 0; j < interpolatorArray.length; j++) {
        let interpH = interpolatorArray[j](0.25);
        x_dates.push(interpH[0]);
        y_depths.push(Math.round(interpH[1]));
        z_value.push(interpH[2]);
      }


      // second interpolation
      let coord3 = [];
      let dataArray3 = [x_dates, y_depths, z_value];
      for (let set2 in x_dates) {
        coord3.push([x_dates[set2], y_depths[set2], z_value[set2]]);
      }
      let interpolatorArray3 = [];
      for (let m = 0, n = 1; m < coord3.length; m++ , n++) {
        interpolatorArray3.push(d3.interpolateObject(coord3[m], [dataArray3[0][n], dataArray3[1][n], dataArray3[2][n]]));
      }
      for (let r = 0; r < interpolatorArray3.length; r++) {
        let interpH3 = interpolatorArray3[r](0.25);
        x_dates.push(interpH3[0]);
        y_depths.push(Math.round(interpH3[1]));
        z_value.push(interpH3[2]);
      }
    }




    // define direction of color palette
    if (this.measureParam.startsWith("Sauerstoff")) {
      this.reversedColor = false;
    }
    else {
      this.reversedColor = true;
    }
    /**
     * define dataset for isoplethen graph
     * by defining z,x and y values and coloring and contour definitions
     */
    let contourData = {
      z: z_value,
      x: x_dates,
      y: y_depths,
      type: "contour",
      colorscale: this.colorscale,
      autocontour: this.autocontourValue,
      ncontours: this.numIso,
      contours: {
        start: this.start_iso,
        end: this.end_iso,
        size: this.distIso,
        showlines: false,
      },
      colorbar: {
        title: this.measureParam,
        titleside: 'right',
        titlefont: {
          size: 14,
          family: 'Arial, sans-serif'
        },
      },
      reversescale: this.reversedColor,
    };

    /**
     * draw borderline for ground surface
     */
    let borderLine = {
      x: this.measureDates,
      y: this.maxDepth,
      type: 'scatter',
      marker: {
        size: 1
      },
      line: {
        width: 10,
        color: 'grey'
      },
      hoverinfo: 'none',
      showlegend: false,
    };

    /**
     *  set max Depth Value of dam
     */
    let groundTruth_Values = [];


    /**
       *  fill space between graph and borderline of ground
       */

    for (let k in this.measureDates) {
      groundTruth_Values.push(d3.max(this.maxDepth));
    }
    let groundTruth = {
      x: this.measureDates,
      y: groundTruth_Values,
      type: 'scatter',
      fill: 'tonexty',
      marker: {
        size: 0.1
      },
      fillcolor: 'white',
      line: {
        width: 0,
        color: 'white'
      },
      showlegend: false,
      hoverinfo: 'none',
    };

    /**
     * set layout of isoplethen graph
     */
    var layout = {
      title: this.damLabel + " " + this.year,
      xaxis: {
        side: 'top',
        tickmode: 'auto',
        nticks: 12,
        range: [new Date(this.timespan.from), new Date(this.timespan.to)],
        type: 'date',
        mirror: 'allticks',
        tickcolor: '#000',
        color: '#000',
        showline: true,
      },
      yaxis: {
        title: 'Tiefe [m]',
        autorange: 'reversed',
        tick0: 0,
        dtick: 2.5,
        tickcolor: '#000',
        mirror: 'allticks',
        showline: true,
        color: '#000',
      },
      font: {
        size: 14
      },
      height: 600
    };

    /**
     * set config parameters for plotly modeBar
     */
    var config = {
      locale: 'de',
      toImageButtonOptions: {
        format: 'png',
        height: height,
        width: width,
      },
      displayModeBar: true,
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian',
        'hoverCompareCartesian', 'toggleSpikelines', 'pan2d', 'zoomOut2d', 'zoomIn2d', 'autoScale2d', 'resetScale2d'],
    };

    /**
     * define dataset and draw isoplethen graph
     */
    let plotlyData = [contourData, borderLine, groundTruth];
    this.plot = Plotly.newPlot(this.swappChart.nativeElement, plotlyData, layout, config);
  }

  calculateDelaunayTriang(dates: Date[], depths: number[], values: number[]): IsoplethenDatasetSchema[] {
    let result = [];
    let interpolDat = [];
    let interpolDep = [];
    let interpolVal = [];

    for (let t = 0; t < dates.length - 13; t++) {
      interpolVal.push(d3.interpolateNumber(values[t], values[t + 13]));
      interpolDat.push(d3.interpolateDate(dates[t], dates[t + 13]));
      interpolDep.push(d3.interpolateNumber(depths[t], depths[t + 13]));
    }

    interpolVal.forEach((val, i, array) => {
      let interpH3 = array[i](0.5);
      values.push(interpH3);
    });

    for (let i = 0; i < interpolDat.length; i++) {
      let interpDat = interpolDat[i](0.5);
      dates.push(interpDat);
    };

    interpolDep.forEach((val, i, array) => {
      let interpDep = array[i](0.5);
      depths.push(interpDep);
    });


    for (let p = 0; p < dates.length; p++) {
      result.push({
        date: dates[p],
        value: values[p],
        depth: depths[p]
      });
    }
    return result;
  }
}
