import { Component, OnInit, Input, OnChanges } from '@angular/core';
import Plotly from 'plotly.js-dist';
import * as esri from 'esri-leaflet';
import { locale } from 'src/environments/environment.prod';
import { LatLngBounds, LatLng, polygon } from 'leaflet';



export class StatisticData {
  date: Date;
  class: number;
  value: number;
}


@Component({
  selector: 'wv-copernicus-layer-chart',
  templateUrl: './copernicus-layer-chart.component.html',
  styleUrls: ['./copernicus-layer-chart.component.css']
})
/**
 *  component to draw PieChart for percentage values of selected Layers histogram
 * @Input parameters:
 *            selectedTimeIndex: the selected Index of the layer to query
 *            chartID: the id of the chart to be drawn
 *            bounds: bounds of Map View to calculate the histogram for
 *            service: Service url to request the histogram from
 *            categoryValues: Catgeory Labels for Chart
 *            colors: Colors for Chart
 */
export class CopernicusLayerChartComponent implements OnInit,OnChanges {
  public headers: string[] = [];
  public entries = [];
  public dataArr: string[];
  public responseInterp: string;
  public stats: StatisticData[] = [];
  public values: number[] = [];
  public labels: string[] = [];
  public colorRgb: string[] = [];
  public selectedTime: Date = new Date();
  public selectedIndex: number = 1;

  @Input() drawChart: boolean = false;
  @Input() selectedTimeIndex: number;
  @Input() chartId: string;
  @Input() bounds: LatLngBounds|LatLng[];
  @Input() service: string;
  @Input() colors: string[];
  @Input() categoryValues: string[];
  
  constructor() { }

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
        let geometryType ='esriGeometryEnvelope';
        let geometry ={"xmin":polygon(this.bounds).getBounds().toBBoxString().split(',')[1],
        "ymin": polygon(this.bounds).getBounds().toBBoxString().split(',')[0],
        "xmax":polygon(this.bounds).getBounds().toBBoxString().split(',')[3],
        "ymax":polygon(this.bounds).getBounds().toBBoxString().split(',')[2],"spatialReference":{"wkid":4326}};
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
        let geometryType ='esriGeometryEnvelope';
        let geometry ={"xmin":polygon(this.bounds).getBounds().toBBoxString().split(',')[1],
        "ymin": polygon(this.bounds).getBounds().toBBoxString().split(',')[0],
        "xmax":polygon(this.bounds).getBounds().toBBoxString().split(',')[3],
        "ymax":polygon(this.bounds).getBounds().toBBoxString().split(',')[2],"spatialReference":{"wkid":4326}};
        this.createPieChart(geometryType,geometry);
      }
     }
   }
  }

  ngOnInit() {

    if(this.bounds instanceof LatLngBounds){
      let geometryType ='esriGeometryEnvelope';
      let geometry ={"xmin":this.bounds.toBBoxString().split(',')[0],
      "ymin": this.bounds.toBBoxString().split(',')[1],
      "xmax":this.bounds.toBBoxString().split(',')[2],
      "ymax":this.bounds.toBBoxString().split(',')[3],"spatialReference":{"wkid":4326}};
      this.createPieChart(geometryType,geometry);
    }else{
      let geometryType ='esriGeometryEnvelope';
      let geometry ={"xmin":polygon(this.bounds).getBounds().toBBoxString().split(',')[1],
      "ymin": polygon(this.bounds).getBounds().toBBoxString().split(',')[0],
      "xmax":polygon(this.bounds).getBounds().toBBoxString().split(',')[3],
      "ymax":polygon(this.bounds).getBounds().toBBoxString().split(',')[2],"spatialReference":{"wkid":4326}};
      this.createPieChart(geometryType,geometry);
    }
   
  }

  /**
   * method creates a pie chart with percentage Values for the defined classes
   */
  public createPieChart(geomType: string, geom: Object) {
    Plotly.register(locale);

    esri.imageService({ url: this.service })
       .get('computeHistograms',
      {geometryType:geomType, 
      geometry:geom,
      outSR: 4326,
      mosaicRule:{"mosaicMethod":"esriMosaicNorthwest","where":"OBJECTID="+this.selectedTimeIndex}},(error,response)=>{ 
   // .get((this.selectedTimeIndex) +"/info/histograms",{},(error,response)=>{

      if (error) {
        console.log(error);
      } else {
        let val = [];
        for (let p = 1; p < response.histograms[0].counts.length; p++) {
          val.push(response.histograms[0].counts[p]);
          this.labels.push(this.categoryValues[p]);
          this.colorRgb.push(this.colors[p]);
        }
        this.values = val;
        var data = [{
          type: "pie",
          values: this.values,
          labels: this.labels,
          textinfo: "percent",
          marker: {
            colors: this.colorRgb
          },
          automargin: true,
          textposition: this.calculateTextpositions(this.values)
        }];

        var layout = {
          width: 240,
          height: 195,
          margin: { "t": 0, "b": 20, "l": 40, "r": 40 },
          showlegend: false,
        }
        var config={
          locale: 'de',
          responsive: true
        }
    
        Plotly.newPlot(this.chartId, data,layout, config)
      }
    });

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
