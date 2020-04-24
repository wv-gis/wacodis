import { Component, OnInit, Input, OnChanges } from '@angular/core';
import Plotly from 'plotly.js-dist';
import * as esri from 'esri-leaflet';
import { locale } from 'src/environments/environment.prod';



export class StatisticData {
  date: Date;
  class: number;
  value: number;
}

const categoryVal = ["no Data", "Acker - Mais", "Acker - sonstige Ackerfruch", "Gewaesser","unbekanntGF",
   "Siedlung - Gewerbe", "Gruenland - unbestimmt", "Gruenland - Gestruepp",
  "Offenboden", "Siedlung geschlossen", "Siedlung offen", "Verkehrsflaeche", "Laubbaeume",
  "unbekanntM", "Nadelbaeume", "Acker - Raps", "Acker - unbewachsen", "Acker - Zwischenfrucht",
  "unbekanntA", "unbekanntAs", "Acker-sonstiges-Offenboden", "Acker-Mais-Offenboden",
  "Acker-Mais-Zwischenfrucht", "Acker-Raps-Offenboden", "Acker-Raps-Zwischenfrucht"];
  const colors = ["rgb(0,0,0)","rgb(255,215,0)","rgb(184,134,11)","rgb(65,105,225)","rgb(30,144,255)","rgb(190,190,190)","rgb(192,255,62)",
  "rgb(189,183,107)","rgb(139,69,19)","rgb(205,92,92)","rgb(250,128,144)","rgb(186,85,211)","rgb(60,179,113)","rgb(0,0,0)","rgb(49,139,87)",
  "rgb(255,255,0)","rgb(205,133,63)","rgb(210,180,140)","rgb(0,0,0)","rgb(0,0,0)","rgb(255,218,185)","rgb(255,250,205)",
  "rgb(255,246,143)","rgb(205,205,0)","rgb(238,238,0)" ];
@Component({
  selector: 'wv-copernicus-layer-chart',
  templateUrl: './copernicus-layer-chart.component.html',
  styleUrls: ['./copernicus-layer-chart.component.css']
})
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
  
  constructor() { }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if(changes.selectedTimeIndex.firstChange){

    }else{
      this.createPieChart();
    }
   
  }

  ngOnInit() {
    this.createPieChart();
  }

  /**
   * method creates a pie chart with percentage Values for the defined classes
   */
  public createPieChart() {
    Plotly.register(locale);

    esri.imageService({ url: 'https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service/ImageServer' })
    .get((this.selectedTimeIndex) +"/info/histograms",{},(error,response)=>{
      if (error) {
        console.log(error);
      } else {
        let val = [];
        for (let p = 1; p < response.histograms[0].counts.length; p++) {
          val.push(response.histograms[0].counts[p]);
          this.labels.push(categoryVal[p]);
          this.colorRgb.push(colors[p]);
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
          width: 200,
          height: 220,
          margin: { "t": 0, "b": 0, "l": 0, "r": 40 },
          showlegend: false,
          // title: 'Landbedeckung ' + this.selectedTime.toDateString(),
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
   * @param values  which define the parts of the pie
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
