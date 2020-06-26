import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import Plotly from 'plotly.js-dist';
import * as esri from "esri-leaflet";

@Component({
  selector: 'wv-tsbar-chart',
  templateUrl: './tsbar-chart.component.html',
  styleUrls: ['./tsbar-chart.component.css']
})
export class TSBarChartComponent implements OnInit, AfterViewInit {

  @Input() barChartId: string;
  @Input() service: string;
  @Input() selIndices?: number;


  public values: number[] = [];
  public labels: string[] = [];
  public colorRgb: string[] = [];

  constructor() { }
  ngAfterViewInit(): void {

    this.plotBarChart();
  }

  ngOnInit() {
    // this.values = [10, 15, 8, 20];
    // this.labels = ['Dhuenn', 'Wupper', 'Kerspe', 'Herbringhauser'];

  }


  public plotBarChart() {
    // console.log(this.selIndices);
    // esri.featureLayer({ url: this.service + '/' + this.selIndices }).eachFeature((layer) => {
    //   console.log(layer.feature.properties);

    // });

    esri.featureLayer({ url: this.service + '/' + this.selIndices }).query().run((e, fCol, resp) => {
      if (e) {
        console.log(e);
      }
      else {
        console.log(fCol);
        fCol.features.forEach((a, i, arr) => {
          this.labels.push(arr[i].properties.Name);
          this.values.push(arr[i].properties.rsv_yearavg_csv_SED_IN);
        });
        var data = [{
          type: "bar",
          x: this.labels,
          y: this.values,
        
          name: 'Sedimenteintrag'
        },
        ];
    
        var layout = {
          width: 700,
          height: 250,
          margin: { "t": 30, "b": 60, "l": 60, "r": 10 },
          showlegend: true,
          barmode: 'group',
          title: {
            text: 'Sedimenteintrag pro Jahr [t]',
          font: {
            family: 'Arial',
            size: 14
          }
        }
        }
        var config = {
          locale: 'de',
          responsive: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian',
            'hoverCompareCartesian', 'toggleSpikelines', 'pan2d', 'zoomOut2d', 'zoomIn2d', 'autoScale2d', 'resetScale2d'],
        }
    
        Plotly.newPlot(this.barChartId, data, layout, config)
      }

    });

    
  }

}
