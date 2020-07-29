import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { Timespan, ApiV3Dataset, ApiV3InterfaceService, DatasetType } from '@helgoland/core';
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
export class IsoplethenGraphicComponent implements OnInit, OnChanges {

  @Input() autocontourValue: boolean = false;
  @Input() numIso: number = 15;// number of isolines
  @Input() distIso: number = 1;// distance between isolines
  @Input() colorscale: any[] = this.setDefaultColorScale();
  @Input() timespan: Timespan;
  @Input() datasetID: string;
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

  private setDefaultColorScale(): any[] {
    return [[0, 'rgb(230,25,75)'], [0.25, 'rgb(255,255,0)'], [0.45, 'rgb(0,255,0)'],
    [0.65, 'rgb(0,255,216)'], [0.85, 'rgb(51,102,255)'], [1, 'rgb(0,51,255)']];
  }

  constructor(
    private swappApi: ApiV3InterfaceService,

  ) { }

  ngOnInit(): void {
    Plotly.register(locale);
    // const serviceId: string =" this.dsUtils.getServiceId(this.dataset);";
    // const timespan =" this.dsUtils.timespanToIsoPeriod(this.timespan);";
   this.receiveDatasets();
  }

  receiveDatasets(){
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
    else if (changes.datasetID) {
      if (!changes.datasetID.firstChange) {
        this.samplings_Dataset =[];
        this.maxDepth =[];
        this.measureDates =[];
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
      //      Plotly.purge("isoplethenView");
    }

    let x_dates = [], y_depths = [], z_value = [];
    let biData = [];

    for (let q = 0; q < this.samplings_Dataset.length; q++) {
      x_dates.push(this.samplings_Dataset[q].date);
      y_depths.push(this.samplings_Dataset[q].depth);
      z_value.push(this.samplings_Dataset[q].value);
      biData.push({
        x: this.samplings_Dataset[q].date.getTime(),
        y: this.samplings_Dataset[q].depth,
        z: this.samplings_Dataset[q].value
      })
    }

    // interpolation of the dataset
    let coord = [];
    let dataArray = [x_dates, y_depths, z_value];

    for (let set in x_dates) {
      coord.push([x_dates[set], y_depths[set], z_value[set]]);
    }

    let interpolatorArray = [];
    for (let i = 0, k = 1; i < coord.length; i++ , k++) {

      if (dataArray[1][k] >= 16)
        interpolatorArray.push(d3.interpolateObject(coord[i], [dataArray[0][k], dataArray[1][k], dataArray[2][k]]));
    }
    for (let j = 0; j < interpolatorArray.length; j++) {
      let interpH = interpolatorArray[j](0.5);

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
      if (dataArray3[1][n] >= 18)
        interpolatorArray3.push(d3.interpolateObject(coord3[m], [dataArray3[0][n], dataArray3[1][n], dataArray3[2][n]]));
    }
    for (let r = 0; r < interpolatorArray3.length; r++) {
      let interpH3 = interpolatorArray3[r](0.5);

      x_dates.push(interpH3[0]);
      y_depths.push(Math.round(interpH3[1]));
      z_value.push(interpH3[2]);
    }

    let coord4 = [];
    for (let set3 in x_dates) {
      coord4.push([x_dates[set3], y_depths[set3], z_value[set3]]);
    }

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
}
