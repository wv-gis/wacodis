import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map.js';
import BaseLayer from 'ol/layer/Base';
import Layer from 'ol/layer/Layer';
import { Tile } from 'ol/layer';
import { OSM, TileWMS, ImageWMS, ImageArcGISRest } from 'ol/source';
import * as esri from 'esri-leaflet';
import { RequestTokenService } from 'src/app/services/request-token.service';
import { OlMapService } from '@helgoland/open-layers';
import ImageLayer from 'ol/layer/Image';
import Plotly from 'plotly.js-dist';
import { CsvDataService } from 'src/app/settings/csvData.service';
import { StatisticData } from 'src/app/map/menu/layer-tree/layer-tree.component';



const categoryVal = ["no Data", "Acker - Mais", "Acker - sonstige Ackerfrucht", "Gewaesser",
  "Gewaesser stehend", "Siedlung - Gewerbe", "Gruenland - unbestimmt", "Gruenland - Gestruepp",
  "Offenboden", "Siedlung geschlossen", "Siedlung offen", "Verkehrsflaeche", "Laubbaeume",
  "Mischwald", "Nadelbaeume", "Acker - Raps", "Acker - unbewachsen", "Acker - Zwischenfrucht",
  "unbekannt", "unbekannt", "Acker-sonstiges-Offenboden", "Acker-Mais-Offenboden",
  "Acker-Mais-Zwischenfrucht", "Acker-Raps-Offenboden", "Acker-Raps-Zwischenfrucht"];
  const colors = ["rgb(0,0,0)","rgb(255,215,0)","rgb(184,134,11)","rgb(65,105,225)","rgb(30,144,255)","rgb(190,190,190)","rgb(192,255,62)",
  "rgb(189,183,107)","rgb(139,69,19)","rgb(205,92,92)","rgb(250,128,144)","rgb(186,85,211)","rgb(60,179,113)","rgb(0,0,0)","rgb(49,139,87)",
  "rgb(255,255,0)","rgb(205,133,63)","rgb(210,180,140)","rgb(0,0,0)","rgb(0,0,0)","rgb(255,218,185)","rgb(255,250,205)",
  "rgb(255,246,143)","rgb(205,205,0)","rgb(238,238,0)" ];
const intraLandService = 'https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service/ImageServer';


@Component({
  selector: 'wv-land-cover',
  templateUrl: './land-cover.component.html',
  styleUrls: ['./land-cover.component.css']
})
export class LandCoverComponent implements OnInit {

  public showZoomControl = true;
  public showAttributionControl = true;
  public map: Map;

  public baselayers: BaseLayer[] = [];
  public overviewMapLayers: Layer[] = [new Tile({
    source: new OSM()
  })];
  public zoom = 11;
  public lat = 51.15;
  public lon = 7.22;

  public token: string = '';
  public sentinelLayer: esri.ImageMapLayer;
  public mapId = 'landcover-map';

  public headers: string[] = [];
  public entries = [];
  public dataArr: string[];
  public responseInterp: string;
  public stats: StatisticData[] = [];
  public values: number[] = [];
  public labels: string[] = [];
  public colorRgb: string[] = [];
  public selectedTime: Date = new Date();

  constructor(private mapService: OlMapService, private requestTokenSrvc: RequestTokenService, private csvService: CsvDataService) {
    // this.responseInterp = csvService.getInterpText(); 
  }

  ngOnInit() {

    // let csvInterArray = this.responseInterp.split(/\r\n|\n/);
    
    //     let header = ['Datum', 'Klasse', 'Wert'];
    //     for (let j = 0; j < header.length; j++) {
    //       this.headers.push(header[j]);
    //     }
    //     for (let k = 1; k < csvInterArray.length; k++) {
    //       this.dataArr = csvInterArray[k].split(';'); // Zeilen
    //       let col = [];
    //       for (let i = 0; i < this.dataArr.length; i++) {
    //         col.push(this.dataArr[i]); //Spalten
    //       }
    //       this.entries.push(col);
    //     }
    //     for (let p = 0; p < this.entries.length; p++) {
    //       this.stats.push({
    //         date: new Date(this.entries[p][0].split('.')[2], this.entries[p][0].split('.')[1] - 1, this.entries[p][0].split('.')[0]),
    //         class: this.entries[p][1],
    //         value: this.entries[p][2],
    //       });
    //     }
    
        // for (let k = 0; k < this.stats.length; k++) {
        //   if (this.selectedTime.toDateString() == this.stats[k].date.toDateString()) {
        //     this.values.push(this.stats[k].value);
        //     this.labels.push(categoryVal[this.stats[k].class]);
        //     this.colorRgb.push(colors[this.stats[k].class]);
            
        //   }
        // }
        // var data = [{
        //   type: "pie",
        //   values: this.values,
        //   labels: this.labels,
        //   textinfo: "percent",
        //   marker: {
        //     colors: this.colorRgb
        //   },
        // }];
    
        // var data=[
        //   {x: [this.stats[0].date,this.stats[15].date,this.stats[29].date,this.stats[43].date,this.stats[57].date,
        //     this.stats[71].date,this.stats[85].date,this.stats[99].date,this.stats[112].date], 
        //     y:[this.stats[0].value,this.stats[15].value,this.stats[29].value,this.stats[43].value,this.stats[57].value,
        //     this.stats[71].value,this.stats[85].value,this.stats[99].value,this.stats[112].value ], 
        //     stackgroup: 'one', groupnorm:'percent', name: categoryVal[this.stats[0].class]},
        //     {x: [this.stats[1].date,this.stats[16].date,this.stats[30].date,this.stats[44].date,this.stats[58].date,
        //       this.stats[72].date,this.stats[86].date,this.stats[100].date,this.stats[113].date], 
        //       y:[this.stats[1].value,this.stats[16].value,this.stats[30].value,this.stats[44].value,this.stats[58].value,
        //       this.stats[72].value,this.stats[86].value,this.stats[100].value,this.stats[113].value ], 
        //       stackgroup: 'one', name: categoryVal[this.stats[1].class]},
        //       {x: [this.stats[2].date,this.stats[17].date,this.stats[31].date,this.stats[45].date,this.stats[59].date,
        //         this.stats[73].date,this.stats[87].date,this.stats[101].date,this.stats[114].date], 
        //         y:[this.stats[2].value,this.stats[17].value,this.stats[31].value,this.stats[45].value,this.stats[59].value,
        //         this.stats[73].value,this.stats[87].value,this.stats[101].value,this.stats[114].value ], 
        //         stackgroup: 'one', name: categoryVal[this.stats[2].class]},
        //         {x: [this.stats[3].date,this.stats[18].date,this.stats[32].date,this.stats[46].date,this.stats[60].date,
        //           this.stats[74].date,this.stats[88].date,this.stats[102].date,this.stats[115].date], 
        //           y:[this.stats[3].value,this.stats[18].value,this.stats[32].value,this.stats[46].value,this.stats[60].value,
        //           this.stats[74].value,this.stats[88].value,this.stats[102].value,this.stats[115].value ], 
        //           stackgroup: 'one', name: categoryVal[this.stats[3].class]},
        //           {x: [this.stats[4].date,this.stats[19].date,this.stats[33].date,this.stats[47].date,this.stats[61].date,
        //             this.stats[75].date,this.stats[89].date,this.stats[103].date,this.stats[116].date], 
        //             y:[this.stats[4].value,this.stats[19].value,this.stats[33].value,this.stats[47].value,this.stats[61].value,
        //             this.stats[75].value,this.stats[89].value,this.stats[103].value,this.stats[116].value ], 
        //             stackgroup: 'one', name: categoryVal[this.stats[4].class]},
        //             {x: [this.stats[5].date,this.stats[20].date,this.stats[34].date,this.stats[48].date,this.stats[62].date,
        //               this.stats[76].date,this.stats[90].date,this.stats[104].date,this.stats[117].date], 
        //               y:[this.stats[5].value,this.stats[20].value,this.stats[34].value,this.stats[48].value,this.stats[62].value,
        //               this.stats[76].value,this.stats[90].value,this.stats[104].value,this.stats[117].value ], 
        //               stackgroup: 'one', name: categoryVal[this.stats[5].class]},
        //               {x: [this.stats[6].date,this.stats[21].date,this.stats[35].date,this.stats[49].date,this.stats[63].date,
        //                 this.stats[77].date,this.stats[91].date,this.stats[105].date,this.stats[118].date], 
        //                 y:[this.stats[6].value,this.stats[21].value,this.stats[35].value,this.stats[49].value,this.stats[63].value,
        //                 this.stats[77].value,this.stats[91].value,this.stats[105].value,this.stats[118].value ], 
        //                 stackgroup: 'one', name: categoryVal[this.stats[6].class]},
        //                 {x: [this.stats[7].date,this.stats[22].date,this.stats[36].date,this.stats[50].date,this.stats[64].date,
        //                   this.stats[78].date,this.stats[92].date,this.stats[106].date,this.stats[119].date], 
        //                   y:[this.stats[7].value,this.stats[22].value,this.stats[36].value,this.stats[50].value,this.stats[64].value,
        //                   this.stats[78].value,this.stats[92].value,this.stats[106].value,this.stats[119].value ], 
        //                   stackgroup: 'one', name: categoryVal[this.stats[7].class]},
        //                   {x: [this.stats[8].date,this.stats[23].date,this.stats[37].date,this.stats[51].date,this.stats[65].date,
        //                     this.stats[79].date,this.stats[93].date,this.stats[107].date,this.stats[120].date], 
        //                     y:[this.stats[8].value,this.stats[23].value,this.stats[37].value,this.stats[51].value,this.stats[65].value,
        //                     this.stats[79].value,this.stats[93].value,this.stats[107].value,this.stats[120].value ], 
        //                     stackgroup: 'one', name: categoryVal[this.stats[8].class]},
    
    
        //                     {x: [this.stats[9].date,this.stats[24].date,this.stats[38].date,this.stats[52].date,this.stats[66].date,
        //                      ], 
        //                       y:[this.stats[9].value,this.stats[24].value,this.stats[38].value,this.stats[52].value,this.stats[66].value,
        //                      ], stackgroup: 'one', name: categoryVal[this.stats[9].class]},
        //                       {x: [this.stats[10].date,this.stats[25].date,this.stats[38].date,this.stats[52].date,this.stats[66].date,
        //                         this.stats[80].date,this.stats[94].date,this.stats[108].date,this.stats[121].date], 
        //                         y:[this.stats[10].value,this.stats[25].value,this.stats[38].value,this.stats[52].value,this.stats[66].value,
        //                         this.stats[80].value,this.stats[94].value,this.stats[108].value,this.stats[121].value ], 
        //                         stackgroup: 'one', name: categoryVal[this.stats[10].class]},
        //                         {x: [this.stats[11].date,this.stats[25].date,this.stats[39].date,this.stats[53].date,this.stats[67].date,
        //                           this.stats[81].date,this.stats[95].date,this.stats[109].date,this.stats[122].date], 
        //                           y:[this.stats[11].value,this.stats[25].value,this.stats[39].value,this.stats[53].value,this.stats[67].value,
        //                           this.stats[81].value,this.stats[95].value,this.stats[109].value,this.stats[122].value ], 
        //                           stackgroup: 'one', name: categoryVal[this.stats[11].class]},

        //                           {x: [this.stats[12].date,,this.stats[123].date], 
        //                             y:[this.stats[12].value,this.stats[123].value ], 
        //                             stackgroup: 'one', name: categoryVal[this.stats[12].class]},
        //                             {x: [this.stats[13].date,this.stats[26].date,this.stats[40].date,this.stats[54].date,this.stats[68].date,
        //                               this.stats[82].date,this.stats[96].date,this.stats[110].date,this.stats[123].date], 
        //                               y:[this.stats[13].value,this.stats[26].value,this.stats[40].value,this.stats[54].value,this.stats[68].value,
        //                               this.stats[82].value,this.stats[96].value,this.stats[110].value,this.stats[123].value ], 
        //                               stackgroup: 'one', name: categoryVal[this.stats[13].class]},
    
        // ]
    
    
        // var layout = {
     
   
        //   showlegend: true,
          // title: 'Landbedeckung ' + this.selectedTime.toDateString(),
        // }
    
        // Plotly.newPlot('pieChart', data, layout,{responsive: true})
      



    this.mapService.getMap(this.mapId).subscribe((map) => {
      map.getLayers().clear();
      map.addLayer(new Tile({
        source: new OSM()
      }));
    });

    this.baselayers.push(
      new ImageLayer({
        visible: true,
        source: new ImageArcGISRest({
          ratio: 1,
          params: {
            'LAYERS': 'Wacodis/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service',
          },
          url: intraLandService
        })
      })
    );
  }

}
