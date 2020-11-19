import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import Plotly from 'plotly.js-dist';
import * as esri from "esri-leaflet";
import { locale } from 'src/environments/environment';

@Component({
  selector: 'wv-tsbar-chart',
  templateUrl: './tsbar-chart.component.html',
  styleUrls: ['./tsbar-chart.component.css']
})
/**
 * Component to plot bar chart for reservoir sediment and nitrate values
 * @barChartID id of the html element to draw barChart
 * @service service url to request values from
 * @selIndices Indices of layers to request values from
 * @input parameter to differentiate between nitrate and sediment values
 * @comparison wether two plot two scenarios in barChart or single scenario
 */
export class TSBarChartComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() barChartId: string;
  @Input() service: string;
  @Input() selIndices?: number[];
  @Input() input: number;
  @Input() comparison?: boolean = false;

  public values: number[] = [];
  public labels: string[] = [];
  public valuesSz: number[] = [];
  public labelsSz: string[] = [];
  public colorRgb: string[] = ["rgb(255,215,0)", "rgb(184,134,11)", "rgb(65,105,225)",
    "rgb(30,144,255)", "rgb(190,190,190)", "rgb(192,255,62)", "rgb(189,183,107)", "rgb(139,69,19)"];

  public title: string[] = ["Sedimenteintrag pro Jahr [t]", "Stickstoffeintrag pro Jahr [kg N]"];

  constructor() { }

/**
 * 
 * @param changes if selIndices change on selection replot graph
 */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.selIndices.firstChange) {
      this.plotBarChart();
    }
  }
  /**
   * After Initializatoin plot graph and register locale for graph values
   */
  ngAfterViewInit(): void {
    Plotly.register(locale);
    this.plotBarChart();
  }

  ngOnInit() {


  }

/**
 * request values and draw barChart depending on compariosn Value
 */
  public plotBarChart() {


    if (!this.comparison) {
 
      esri.featureLayer({ url: this.service + '/' + this.selIndices[0] }).query().run((e, fCol, resp) => {
        if (e) {
          console.log(e);
        }
        else {
          let val = [];
          if (this.input == 0) {
            fCol.features.forEach((a, i, arr) => {
              this.labels.push(arr[i].properties.Name);
              val.push(parseFloat(arr[i].properties.rsv_yearavg_csv_SED_IN));
            });
            this.values = val;
          } else {
            let vals =[]
            fCol.features.forEach((a, i, arr) => {
              this.labels.push(arr[i].properties.Name);
              vals.push(parseFloat(arr[i].properties.rsv_yearavg_csv_NO3_IN));
   
            });
            this.values=vals;
        
         
          }

          var data = [{
            type: "bar",
            x: this.labels,
            y: this.values,
            // marker: {
            //   color: this.colorRgb
            // },
            name: this.title[this.input]
          },
          ];

          var layout = {
            // width: 800,
            height: 275,
            margin: { "t": 30, "b": 60, "l": 60, "r": 10 },
            showlegend: false,

            title: {
              text: this.title[this.input],
              font: {
                family: 'Arial',
                size: 14
              }
            },
            yaxis:{
              showline: true
            },
         
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
    else {

      esri.featureLayer({ url: this.service  + this.selIndices[0] }).query().run((e, fCol, resp) => {
        if (e) {
          console.log(e);
        }
        else {
          esri.featureLayer({ url: this.service + this.selIndices[1] }).query().run((err, featCol, resp) => {
           let val =[];
           let valSz =[];
            if (this.input == 0) {
              fCol.features.forEach((a, i, arr) => {
                this.labels.push(arr[i].properties.Name);
                val.push(parseFloat(arr[i].properties.rsv_yearavg_csv_SED_IN));
              });
              this.values = val;
              featCol.features.forEach((a, i, arr) => {
                this.labelsSz.push(arr[i].properties.Name);
                valSz.push(parseFloat(arr[i].properties.rsv_yearavg_csv_SED_IN));
              });
              this.valuesSz = valSz;
            } else {
              fCol.features.forEach((a, i, arr) => {
                this.labels.push(arr[i].properties.Name);
                val.push(parseFloat(arr[i].properties.rsv_yearavg_csv_NO3_IN));
              });
              this.values = val;
              featCol.features.forEach((a, i, arr) => {
                this.labelsSz.push(arr[i].properties.Name);
                valSz.push(parseFloat(arr[i].properties.rsv_yearavg_csv_NO3_IN));
              });
              this.valuesSz = valSz;
            }

            var data = [{
              type: "bar",
              x: this.labels,
              y: this.values,

              name: 'Szenario 1 ' + this.title[this.input]
            },
            {
              type: "bar",
              x: this.labelsSz,
              y: this.valuesSz,

              name: 'Szenario 2 ' + this.title[this.input]
            }
            ];

            var layout = {
              // width: 800,
              height: 275,
              margin: { "t": 30, "b": 60, "l": 60, "r": 10 },
              showlegend: true,
              barmode: 'group',
              title: {
                text: this.title[this.input],
                font: {
                  family: 'Arial',
                  size: 14
                }
              },
              yaxis:{
                showline: true
              },
              legend: {orientation: 'h', y: -0.25}
            }
            var config = {
              locale: 'de',
              responsive: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian',
                'hoverCompareCartesian', 'toggleSpikelines', 'pan2d', 'zoomOut2d', 'zoomIn2d', 'autoScale2d', 'resetScale2d'],
            }

            Plotly.newPlot(this.barChartId, data, layout, config);
          });
        }

      });
    }


  }

}
