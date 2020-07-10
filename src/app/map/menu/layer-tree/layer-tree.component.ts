import { Component, OnInit, Input } from '@angular/core';
import { legendParam } from '../../legend/extended/extended-ol-layer-legend-url/extended-ol-layer-legend-url.component';
import Plotly from 'plotly.js-dist';
import * as esri from 'esri-leaflet';
import { MapCache } from '@helgoland/map';

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
  selector: 'wv-layer-tree',
  templateUrl: './layer-tree.component.html',
  styleUrls: ['./layer-tree.component.css']
})
/**
 * Component to depict the layer as a list with several functions
 *  show legends of the selected layer shown in the current map
 *  set visibility
 *  set selected time range
 *  show Histogram content
 *  remove Layer
 * @Input baselayers layers to list in the tree
 * @Input mapID corresponding mapId of layers
 * @Input drawChart boolean wether to drw the histogram pie chart or not
 */
export class LayerTreeComponent implements OnInit {
  @Input() baselayers: L.TileLayer[]|esri.ImageMapLayer[];
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
  public selectedIndex: number = 1;

  constructor( private mapCache: MapCache) {    
   
  }

  ngOnInit() {


  }

  /**
   * open or close the layer tree
   */
  public change() {

    if (document.getElementById('map') !== undefined) {
      if (this.isActive) {
        document.getElementById('map').setAttribute('style', ' width: 100%;height: 100%; padding: 5px; position:fixed;');
      }
      else {
        document.getElementById('map').setAttribute('style', 'width: 82% ;height: 100%; padding: 5px; position:fixed;');
      }
    }

    this.mapCache.getMap(this.mapId).invalidateSize();

    this.isActive = !this.isActive;
  }

  /**
   * receive legend Urls to depict the legend of the selected layer
   * @param url 
   * @param urls 
   */
  public getLegendUrl(url?: string, urls?: string[]) {
    // document.getElementById("legendToast").hidden =  false;
    this.legendUrls = [{ url: url, label: "", layer: url.split('layer=')[1] }];
  }
  public getLegendUrls(urls: legendParam[]) {
    // document.getElementById("legendToast").hidden =  true;
    this.legendUrls = urls;
  }
 
/**
 * 
 * @param i remove the selected layer from map and tree
 */
  public removeLayer(i: number) {
    const layer = this.baselayers.splice(i, 1);
    this.mapCache.getMap(this.mapId).removeLayer(layer[0]);
  }

/**
 * get histogram information for selected layer and draw pie chart
 */
  public createPieChart() {

    esri.imageService({ url: 'https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service/ImageServer' })
    .get((this.selectedIndex) +"/info/histograms",{},(error,response)=>{
      if (error) {
        console.log(error);
      } else {
        for (let p = 1; p < response.histograms[0].counts.length; p++) {
          this.values.push(response.histograms[0].counts[p]);
          this.labels.push(categoryVal[p]);
          this.colorRgb.push(colors[p]);
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

        var layout = {
          width: 600,
          height: 400,
          margin: { "t": 0, "b": 0, "l": 0, "r": 0 },
          showlegend: true,
          // title: 'Landbedeckung ' + this.selectedTime.toDateString(),
        }
    
        Plotly.newPlot('pieChart', data, layout,{responsive: true})
      }
    });
  

  }

  /**
   * set the selected time range of the layer
   * @param dat intern number of the service for the selected time range of layer
   */
  public getSelectedTime(dat: number) {
    // this.selectedTime = dat;
    this.selectedIndex = dat+1;
    if(this.drawChart){
      this.createPieChart();
    }
  }
}
