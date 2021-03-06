import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Plotly from 'plotly.js-dist';
import { LatLngBounds, LatLng } from 'leaflet';


@Component({
  selector: 'wv-vitality-bar-chart',
  templateUrl: './vitality-bar-chart.component.html',
  styleUrls: ['./vitality-bar-chart.component.css']
})
/**
 * component for Visualization of Decraes and Increase in Vitality of forest areas for the specified regions
 * as a bar chart
 * @Input
 * chartID --> Dom ID for the diagram
 * service --> which dataset is the basis
 * selIndices --> selected Layer indices to receive data from
 * bounds --> bounds of the selected layer to calculate the dataset for
 * 
 */
export class VitalityBarChartComponent implements OnInit,AfterViewInit {

  @ViewChild("percentBar",{static: true}) public graphElem: ElementRef;

  @Output() selTS: EventEmitter<string> = new EventEmitter();
  @Input() barChartIds: string[];
  @Input() service: string;
  @Input() selIndices?: number[];
  @Input() bounds?: LatLngBounds | LatLng[];


  public values: number[] = [];
  public labels: string[] = [];
  public colorRgb: string[] = [];
  public plot;

  constructor() { }

  ngOnInit() {
    this.values = [10, 15, 8, 20];
    this.labels = ['Dhuenn', 'Wupper', 'Kerspe', 'Herbringhauser'];

    this.plotBarChart();
  }

  /**
   * define type and values for the chart and add styling and config informations
   */

  public plotBarChart() {
    var data = [{
      type: "bar",
      x: this.labels,
      y: this.values,
      marker: {
        color: ['rgb(224,144,144)', 'rgb(224,144,144)', 'rgb(224,144,144)', 'rgb(224,144,144)']
      },
      name: 'Verlust'
    },
    {
      type: "bar",
      x: this.labels,
      y: [5, 10, 4, 15],
      marker: {
        color: ['rgb(31,180,0)', 'rgb(31,180,0)', 'rgb(31,180,0)', 'rgb(31,180,0)']
      },
      name: 'Zunahme'
    }];

    var layout = {
      // width: 600,
      height: 200,
      margin: { "t": 20, "b": 50, "l": 80, "r": 0 },
      showlegend: true,
      yaxis:{
        showline: true,
      },
      barmode: 'group'
    }
    var config = {
      locale: 'de',
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian',
        'hoverCompareCartesian', 'toggleSpikelines', 'pan2d', 'zoomOut2d', 'zoomIn2d', 'autoScale2d', 'resetScale2d'],
    }

    Plotly.newPlot(this.barChartIds[0], data, layout, config);

  }
  ngAfterViewInit(): void {
    this.plot = this.graphElem.nativeElement;

    this.plot.on('plotly_click', this.getLabel);
  
  }

  public getLabel= (event: any) => {
      this.selTS.emit(event.points[0].label);
  }
}
