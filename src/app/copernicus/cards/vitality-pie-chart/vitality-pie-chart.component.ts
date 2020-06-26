import { Component, OnInit, Input, OnChanges,  AfterViewInit } from '@angular/core';
import { LatLngBounds, LatLng } from 'leaflet';
import Plotly from 'plotly.js-dist';
import * as esri from 'esri-leaflet';
import { locale } from 'src/environments/environment.prod';

@Component({
  selector: 'wv-vitality-pie-chart',
  templateUrl: './vitality-pie-chart.component.html',
  styleUrls: ['./vitality-pie-chart.component.css']
})
export class VitalityPieChartComponent implements OnInit,OnChanges, AfterViewInit {
  @Input() selectedTimeIndex: number;
  @Input() chartId: string;
  @Input() bounds: LatLngBounds|LatLng[];
  @Input() service: string;
  @Input() colors: string[];
  @Input() categoryValues: string[];

  public values: number[] = [];
  public labels: string[] = [];
  public colorRgb: string[]=[];
  
  constructor() { }
  ngAfterViewInit(): void {
    console.log(this.chartId);
     if(this.bounds instanceof LatLngBounds){
       let geometryType ='esriGeometryEnvelope';
       let geometry ={"xmin":this.bounds.toBBoxString().split(',')[0],
       "ymin": this.bounds.toBBoxString().split(',')[1],
       "xmax":this.bounds.toBBoxString().split(',')[2],
       "ymax":this.bounds.toBBoxString().split(',')[3],"spatialReference":{"wkid":4326}};
       this.createPieChart(geometryType,geometry);
     }else{
       let geometryType ='esriGeometryPolygon';
            let geometry ={"rings": this.bounds,"spatialReference":{"wkid":4326}};
       
       this.createPieChart(geometryType,geometry);
     }
  }

   /**
   * 
   * @param changes 
   * if bounds or selected layer change redraw the chart based on new calculated values
   */
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if(changes.selectedTimeIndex){
     if(changes.selectedTimeIndex.firstChange){
     }else{
       if(this.bounds instanceof LatLngBounds){
         let geometryType ='esriGeometryEnvelope';
         let geometry ={"xmin":this.bounds.toBBoxString().split(',')[0],
         "ymin": this.bounds.toBBoxString().split(',')[1],
         "xmax":this.bounds.toBBoxString().split(',')[2],
         "ymax":this.bounds.toBBoxString().split(',')[3],"spatialReference":{"wkid":4326}};
         this.createPieChart(geometryType,geometry);
       }else{
         let geometryType ='esriGeometryPolygon';
         let geometry ={"rings": this.bounds,"spatialReference":{"wkid":4326}};

         this.createPieChart(geometryType,geometry);
       }
     }
    }else{
      if(!changes.bounds.firstChange){
       if(this.bounds instanceof LatLngBounds){
         let geometryType ='esriGeometryEnvelope';
         let geometry ={"xmin":this.bounds.toBBoxString().split(',')[0],
         "ymin": this.bounds.toBBoxString().split(',')[1],
         "xmax":this.bounds.toBBoxString().split(',')[2],
         "ymax":this.bounds.toBBoxString().split(',')[3],"spatialReference":{"wkid":4326}};
         this.createPieChart(geometryType,geometry);
       }else{
         let geometryType ='esriGeometryPolygon';
         let geometry ={"rings": this.bounds,"spatialReference":{"wkid":4326}};
   
         this.createPieChart(geometryType,geometry);
       }
      }
    }
   }
 
   ngOnInit() {
    // console.log(this.chartId);
    //  if(this.bounds instanceof LatLngBounds){
    //    let geometryType ='esriGeometryEnvelope';
    //    let geometry ={"xmin":this.bounds.toBBoxString().split(',')[0],
    //    "ymin": this.bounds.toBBoxString().split(',')[1],
    //    "xmax":this.bounds.toBBoxString().split(',')[2],
    //    "ymax":this.bounds.toBBoxString().split(',')[3],"spatialReference":{"wkid":4326}};
    //    this.createPieChart(geometryType,geometry);
    //  }else{
    //    let geometryType ='esriGeometryPolygon';
    //         let geometry ={"rings": this.bounds,"spatialReference":{"wkid":4326}};
       
    //    this.createPieChart(geometryType,geometry);
    //  }
    
   }

   public createPieChart(geomType: string, geom: Object){

    Plotly.register(locale);

    this.values =[10,40,5];
    this.labels = ['gering', 'mittel','stark']
    
    
    var data = [{
      type: "pie",
      values: this.values,
      labels: this.labels,
      textinfo: 'none',
      marker: {
        colors: this.colors
      },
      automargin: true,
     
    }];

    var layout = {
      title: {
        text: 'Veränderung in ha',
      font: {
        family: 'Arial',
        size: 12
      }
    },
      width: 220,
      height: 195,
      margin: { "t": 20, "b": 10, "l": 0, "r": 30 },
      showlegend: false,
    }
    var config={
      locale: 'de',
      responsive: true
    }
 
    Plotly.newPlot(this.chartId, data,layout, config)
  }
   

   
  /**
   * method to define wether or not the percentage label is shown
   * @param values  percentage values which define the parts of the pie
   */
  public calculateTextpositions(values: number[]):string[]{
    let total=0;
    let percentages = []
     values.forEach((element,i,arr) => {
      total = total + element ;
    });
     values.forEach((element,i,arr) => {
    percentages.push((element/total)*100 < 2 ? 'none': 'auto')  ;
    });
    return percentages;
  }
}
