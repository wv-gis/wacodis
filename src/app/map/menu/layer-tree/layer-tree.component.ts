import { Component, OnInit, Input } from '@angular/core';
import { MapCache } from '@helgoland/map';
import BaseLayer from 'ol/layer/Base';
import { OlMapService } from '@helgoland/open-layers';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { legendParam } from '../../legend/extended/extended-ol-layer-legend-url/extended-ol-layer-legend-url.component';
import Plotly from 'plotly.js-dist';
import { CsvDataService } from 'src/app/settings/csvData.service';

export class StatisticData {
  date: Date;
  class: number;
  value: number;
}

const categoryVal = ["no Data", "Acker - Mais", "Acker - sonstige Ackerfruch", "Gewaesser",
  "Gewaesser stehend", "Siedlung - Gewerbe", "Gruenland - unbestimmt", "Gruenland - Gestruepp",
  "Offenboden", "Siedlung geschlossen", "Siedlung offen", "Verkehrsflaeche", "Laubbaeume",
  "Mischwald", "Nadelbaeume", "Acker - Raps", "Acker - unbewachsen", "Acker - Zwischenfrucht",
  "unbekannt", "unbekannt", "Acker-sonstiges-Offenboden", "Acker-Mais-Offenboden",
  "Acker-Mais-Zwischenfrucht", "Acker-Raps-Offenboden", "Acker-Raps-Zwischenfrucht"];
  const colors = ["rgb(0,0,0)","rgb(255,215,0)","rgb(184,134,11)","rgb(65,105,225)","rgb(30,144,255)","rgb(190,190,190)","rgb(192,255,62)",
  "rgb(189,183,107)","rgb(139,69,19)","rgb(205,92,92)","rgb(250,128,144)","rgb(186,85,211)","rgb(60,179,113)","rgb(0,0,0)","rgb(49,139,87)",
  "rgb(255,255,0)","rgb(205,133,63)","rgb(210,180,140)","rgb(0,0,0)","rgb(0,0,0)","rgb(255,218,185)","rgb(255,250,205)",
  "rgb(255,246,143)","rgb(205,205,0)","rgb(238,238,0)" ];
  
@Component({
  selector: 'wv-layer-tree',
  templateUrl: './layer-tree.component.html',
  styleUrls: ['./layer-tree.component.css']
})
export class LayerTreeComponent implements OnInit {
  @Input() baselayers: BaseLayer[];
  @Input() mapId: string;
  @Input() drawChart: boolean = false;

  public isActive = true;
  public display = 'none';
  public legendUrl: string;
  public legendUrls: legendParam[];

  public headers: string[] = [];
  public entries = [];
  public dataArr: string[];
  public responseInterp: string;
  public stats: StatisticData[] = [];
  public values: number[] = [];
  public labels: string[] = [];
  public colorRgb: string[] = [];
  public selectedTime: Date = new Date();

  constructor(private mapService: OlMapService, protected csvService: CsvDataService) {    
    this.responseInterp = csvService.getInterpText(); 
  }

  ngOnInit() {


  }
  public change() {

    if (document.getElementById('map') !== undefined) {
      if (this.isActive) {
        document.getElementById('map').setAttribute('style', ' width: 100%;height: 100%; padding: 5px; position:fixed;');
      }
      else {
        document.getElementById('map').setAttribute('style', 'width: 82% ;height: 100%; padding: 5px; position:fixed;');
      }
    }
    this.mapService.getMap(this.mapId).subscribe(map => map.updateSize());
    this.mapService.getMap(this.mapId).subscribe(map => map.getView());
    // return this.isActive = !this.isActive;

    this.isActive = !this.isActive;
  }

  public getLegendUrl(url?: string, urls?: string[]) {
    // document.getElementById("legendToast").hidden =  false;
    this.legendUrls = [{ url: url, label: "" }];
  }
  public getLegendUrls(urls: legendParam[]) {
    // document.getElementById("legendToast").hidden =  true;
    this.legendUrls = urls;
  }
  public toggleVisibility(layer: BaseLayer) {

    layer.setVisible(!layer.getVisible());
  }

  public removeLayer(i: number) {
    const layer = this.baselayers.splice(i, 1);
    this.mapService.getMap(this.mapId).subscribe(map => map.removeLayer(layer[0]));
  }


  public createPieChart() {
    let csvInterArray = this.responseInterp.split(/\r\n|\n/);

    //Datum;Talsperre;AvgTemp
    let header = ['Datum', 'Klasse', 'Wert'];
    for (let j = 0; j < header.length; j++) {
      this.headers.push(header[j]);
    }
    for (let k = 1; k < csvInterArray.length; k++) {
      this.dataArr = csvInterArray[k].split(';'); // Zeilen
      let col = [];
      for (let i = 0; i < this.dataArr.length; i++) {
        col.push(this.dataArr[i]); //Spalten
      }
      this.entries.push(col);
    }
    for (let p = 0; p < this.entries.length; p++) {
      this.stats.push({
        date: new Date(this.entries[p][0].split('.')[2], this.entries[p][0].split('.')[1] - 1, this.entries[p][0].split('.')[0]),
        class: this.entries[p][1],
        value: this.entries[p][2],
      });
    }

    for (let k = 0; k < this.stats.length; k++) {
      if (this.selectedTime.toDateString() == this.stats[k].date.toDateString()) {
        this.values.push(this.stats[k].value);
        this.labels.push(categoryVal[this.stats[k].class]);
        this.colorRgb.push(colors[this.stats[k].class]);
        
      }
    }
    var data = [{
      type: "pie",
      values: this.values,
      labels: this.labels,
      textinfo: "percent",
      marker: {
        colors: this.colorRgb
      },
    }];

    // var data=[
    //   {x: [this.stats[0].date,this.stats[15].date,this.stats[29].date,this.stats[43].date,this.stats[57].date,
    //     this.stats[71].date,this.stats[85].date,this.stats[99].date,this.stats[112].date], 
    //     y:[this.stats[0].value,this.stats[15].value,this.stats[29].value,this.stats[43].value,this.stats[57].value,
    //     this.stats[71].value,this.stats[85].value,this.stats[99].value,this.stats[112].value ], 
    //     stackgroup: 'one', groupnorm:'percent'},
    //     {x: [this.stats[1].date,this.stats[16].date,this.stats[30].date,this.stats[44].date,this.stats[58].date,
    //       this.stats[72].date,this.stats[86].date,this.stats[100].date,this.stats[113].date], 
    //       y:[this.stats[1].value,this.stats[16].value,this.stats[30].value,this.stats[44].value,this.stats[58].value,
    //       this.stats[72].value,this.stats[86].value,this.stats[100].value,this.stats[113].value ], 
    //       stackgroup: 'one'},
    //       {x: [this.stats[2].date,this.stats[17].date,this.stats[31].date,this.stats[45].date,this.stats[59].date,
    //         this.stats[73].date,this.stats[87].date,this.stats[101].date,this.stats[114].date], 
    //         y:[this.stats[2].value,this.stats[17].value,this.stats[31].value,this.stats[45].value,this.stats[59].value,
    //         this.stats[73].value,this.stats[87].value,this.stats[101].value,this.stats[114].value ], 
    //         stackgroup: 'one'},
    //         {x: [this.stats[3].date,this.stats[18].date,this.stats[32].date,this.stats[46].date,this.stats[60].date,
    //           this.stats[74].date,this.stats[88].date,this.stats[102].date,this.stats[115].date], 
    //           y:[this.stats[3].value,this.stats[18].value,this.stats[32].value,this.stats[46].value,this.stats[60].value,
    //           this.stats[74].value,this.stats[88].value,this.stats[102].value,this.stats[115].value ], 
    //           stackgroup: 'one'},
    //           {x: [this.stats[4].date,this.stats[19].date,this.stats[33].date,this.stats[47].date,this.stats[61].date,
    //             this.stats[75].date,this.stats[89].date,this.stats[103].date,this.stats[116].date], 
    //             y:[this.stats[4].value,this.stats[19].value,this.stats[33].value,this.stats[47].value,this.stats[61].value,
    //             this.stats[75].value,this.stats[89].value,this.stats[103].value,this.stats[116].value ], 
    //             stackgroup: 'one'},
    //             {x: [this.stats[5].date,this.stats[20].date,this.stats[34].date,this.stats[48].date,this.stats[62].date,
    //               this.stats[76].date,this.stats[90].date,this.stats[104].date,this.stats[117].date], 
    //               y:[this.stats[5].value,this.stats[20].value,this.stats[34].value,this.stats[48].value,this.stats[62].value,
    //               this.stats[76].value,this.stats[90].value,this.stats[104].value,this.stats[117].value ], 
    //               stackgroup: 'one'},
    //               {x: [this.stats[6].date,this.stats[21].date,this.stats[35].date,this.stats[49].date,this.stats[63].date,
    //                 this.stats[77].date,this.stats[91].date,this.stats[105].date,this.stats[118].date], 
    //                 y:[this.stats[6].value,this.stats[21].value,this.stats[35].value,this.stats[49].value,this.stats[63].value,
    //                 this.stats[77].value,this.stats[91].value,this.stats[105].value,this.stats[118].value ], 
    //                 stackgroup: 'one'},
    //                 {x: [this.stats[7].date,this.stats[22].date,this.stats[36].date,this.stats[50].date,this.stats[64].date,
    //                   this.stats[78].date,this.stats[92].date,this.stats[106].date,this.stats[119].date], 
    //                   y:[this.stats[7].value,this.stats[22].value,this.stats[36].value,this.stats[50].value,this.stats[64].value,
    //                   this.stats[78].value,this.stats[92].value,this.stats[106].value,this.stats[119].value ], 
    //                   stackgroup: 'one'},
    //                   {x: [this.stats[8].date,this.stats[23].date,this.stats[37].date,this.stats[51].date,this.stats[65].date,
    //                     this.stats[79].date,this.stats[93].date,this.stats[107].date,this.stats[120].date], 
    //                     y:[this.stats[8].value,this.stats[23].value,this.stats[37].value,this.stats[51].value,this.stats[65].value,
    //                     this.stats[79].value,this.stats[93].value,this.stats[107].value,this.stats[120].value ], 
    //                     stackgroup: 'one'}]


    //                     {x: [this.stats[0].date,this.stats[15].date,this.stats[29].date,this.stats[43].date,this.stats[57].date,
    //                       this.stats[71].date,this.stats[85].date,this.stats[99].date,this.stats[112].date], 
    //                       y:[this.stats[0].value,this.stats[15].value,this.stats[29].value,this.stats[43].value,this.stats[57].value,
    //                       this.stats[71].value,this.stats[85].value,this.stats[99].value,this.stats[112].value ], 
    //                       stackgroup: 'one'},
    //                       {x: [this.stats[0].date,this.stats[15].date,this.stats[29].date,this.stats[43].date,this.stats[57].date,
    //                         this.stats[71].date,this.stats[85].date,this.stats[99].date,this.stats[112].date], 
    //                         y:[this.stats[0].value,this.stats[15].value,this.stats[29].value,this.stats[43].value,this.stats[57].value,
    //                         this.stats[71].value,this.stats[85].value,this.stats[99].value,this.stats[112].value ], 
    //                         stackgroup: 'one'},
    //                         {x: [this.stats[0].date,this.stats[15].date,this.stats[29].date,this.stats[43].date,this.stats[57].date,
    //                           this.stats[71].date,this.stats[85].date,this.stats[99].date,this.stats[112].date], 
    //                           y:[this.stats[0].value,this.stats[15].value,this.stats[29].value,this.stats[43].value,this.stats[57].value,
    //                           this.stats[71].value,this.stats[85].value,this.stats[99].value,this.stats[112].value ], 
    //                           stackgroup: 'one'},
    //                           {x: [this.stats[0].date,this.stats[15].date,this.stats[29].date,this.stats[43].date,this.stats[57].date,
    //                             this.stats[71].date,this.stats[85].date,this.stats[99].date,this.stats[112].date], 
    //                             y:[this.stats[0].value,this.stats[15].value,this.stats[29].value,this.stats[43].value,this.stats[57].value,
    //                             this.stats[71].value,this.stats[85].value,this.stats[99].value,this.stats[112].value ], 
    //                             stackgroup: 'one'},
    //                             {x: [this.stats[0].date,this.stats[15].date,this.stats[29].date,this.stats[43].date,this.stats[57].date,
    //                               this.stats[71].date,this.stats[85].date,this.stats[99].date,this.stats[112].date], 
    //                               y:[this.stats[0].value,this.stats[15].value,this.stats[29].value,this.stats[43].value,this.stats[57].value,
    //                               this.stats[71].value,this.stats[85].value,this.stats[99].value,this.stats[112].value ], 
    //                               stackgroup: 'one'},

    // ]


    var layout = {
      width: 600,
      height: 400,
      margin: { "t": 0, "b": 0, "l": 0, "r": 0 },
      showlegend: true,
      // title: 'Landbedeckung ' + this.selectedTime.toDateString(),
    }

    Plotly.newPlot('pieChart', data, layout,{responsive: true})
  }

  public getSelectedTime(dat: Date) {
    this.selectedTime = dat;
    if(this.drawChart){
      this.createPieChart();
    }
  }
}
