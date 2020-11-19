import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import Plotly from 'plotly.js-dist';
import * as esri from "esri-leaflet";
import { locale } from 'src/environments/environment';
@Component({
  selector: 'wv-percentage-change-bar-chart',
  templateUrl: './percentage-change-bar-chart.component.html',
  styleUrls: ['./percentage-change-bar-chart.component.css']
})
export class PercentageChangeBarChartComponent implements AfterViewInit, OnChanges {
  @Input() barChartId: string;
  @Input() service: string;
  @Input() selIndices?: number[];
  @Input() input: number;

  public values: number[] = [];
  public labels: string[] = [];
  public valuesSz: number[] = [];
  public labelsSz: string[] = [];
  public colorRgb: string[] = [ "rgb(255,215,0)", "rgb(184,134,11)", "rgb(65,105,225)", 
  "rgb(30,144,255)", "rgb(190,190,190)", "rgb(192,255,62)","rgb(189,183,107)", "rgb(139,69,19)"];
  public absValues: number[] =[];
  

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.selIndices.firstChange) {
      this.plotBarChart();
    }
  }
  ngAfterViewInit(): void {
    Plotly.register(locale);
    this.plotBarChart();
  }


  public plotBarChart() {

    esri.featureLayer({ url: this.service + '/' + this.selIndices[0] }).query().run((e, fCol, resp) => {
      if (e) {
        console.log(e);
      }
      else {

        esri.featureLayer({ url: this.service + '/' + this.selIndices[1] }).query().run((err, featCol, resp) => {
          if (err)
            console.log(err);

            let labels=[];
            let values=[];
            let valuesSz=[];
            let labelsSz=[];
            let total=[]
            if (this.input == 0) {
              fCol.features.forEach((a, i, arr) => {
                labels.push(arr[i].properties.Name);
                values.push(parseFloat(arr[i].properties.rsv_yearavg_csv_SED_IN));
              });   
              featCol.features.forEach((a, i, arr) => {
                labelsSz.push(arr[i].properties.Name);
                valuesSz.push(parseFloat(arr[i].properties.rsv_yearavg_csv_SED_IN));
              });
              values.forEach((val,n,arr)=>{
                total.push((valuesSz[n]-val)/valuesSz[n]*100);
              });
              this.absValues = total;
              this.labels = labels;
            } 
            else {
              fCol.features.forEach((a, i, arr) => {
                labels.push(arr[i].properties.Name);
                values.push(parseFloat(arr[i].properties.rsv_yearavg_csv_NO3_IN));   
              });
              featCol.features.forEach((a, i, arr) => {
                labelsSz.push(arr[i].properties.Name);
                valuesSz.push(parseFloat(arr[i].properties.rsv_yearavg_csv_NO3_IN));
              });


              values.forEach((val,n,arr)=>{
                total.push((valuesSz[n]-val)/valuesSz[n]*100);
              
              });
            this.absValues = total;
            this.labels = labels;
            
            }


          var data = [{
            type: "bar",
            x: this.absValues,
            y: this.labels,
            orientation: 'h',
            marker: {
              color: this.colorRgb
            }
          }];

          var layout = {
            // width: 600,
            height: 275,
            margin: { "t": 50, "b": 50, "l": 100, "r": 5 },
            showlegend: false,
            title: {
              text: 'Prozentuale Veränderung',
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

          Plotly.newPlot(this.barChartId, data, layout, config);
        });
      }
    });
  }
}
