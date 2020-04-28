import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import Plotly from 'plotly.js-dist';
import * as esri from 'esri-leaflet';
import { locale } from 'src/environments/environment.prod';
import { MapCache } from '@helgoland/map';
import { LatLngBounds } from 'leaflet';

const categoryVal = ["no Data", "Acker - Mais", "Acker - sonstige Ackerfrucht", "Gewaesser", "Gewaesser",
  "Siedlung - Gewerbe", "Gruenland - unbestimmt", "Gruenland - Gestruepp",
  "Offenboden", "Siedlung geschlossen", "Siedlung offen", "Verkehrsflaeche", "Laubbaeume",
  "Laubbaeume", "Nadelbaeume", "Acker - Raps", "Acker - unbewachsen", "Acker - Zwischenfrucht",
  "unbekanntA", "unbekanntAs", "Acker-sonstiges-Offenboden", "Acker-Mais-Offenboden",
  "Acker-Mais-Zwischenfrucht", "Acker-Raps-Offenboden", "Acker-Raps-Zwischenfrucht"];
const colors = ["rgb(0,0,0)", "rgb(255,215,0)", "rgb(184,134,11)", "rgb(65,105,225)", "rgb(30,144,255)", "rgb(190,190,190)", "rgb(192,255,62)",
  "rgb(189,183,107)", "rgb(139,69,19)", "rgb(205,92,92)", "rgb(250,128,144)", "rgb(186,85,211)", "rgb(60,179,113)", "rgb(0,0,0)", "rgb(49,139,87)",
  "rgb(255,255,0)", "rgb(205,133,63)", "rgb(210,180,140)", "rgb(0,0,0)", "rgb(0,0,0)", "rgb(255,218,185)", "rgb(255,250,205)",
  "rgb(255,246,143)", "rgb(205,205,0)", "rgb(238,238,0)"];

@Component({
  selector: 'wv-copernicus-bar-chart-card',
  templateUrl: './copernicus-bar-chart-card.component.html',
  styleUrls: ['./copernicus-bar-chart-card.component.css']
})
export class CopernicusBarChartCardComponent implements OnInit, OnChanges {

  @Input() barChartIds: string[];
  @Input() selIndices: number[];
  @Input() bounds: LatLngBounds;
  @Output() maskData: EventEmitter<string[]> = new EventEmitter<string[]>();
  public firstIndexvalues: number[] = [];
  public secIndexvalues: number[] = [];
  public values: number[] = [];
  public labels: string[] = [];
  public colorRgb: string[] = [];
  public sum: number = 0;
  public renderingRule = {};
  public noDataValues: string[] = [];
  public absLabels: string[]=[];
  public absValues:number[]=[];
  public absColorRgb: string[] = [];
  public absSum = 0;
  constructor(private mapCache: MapCache) { }


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.selIndices) {
      if (!changes.selIndices.firstChange) {
        this.sum = 0;
        this.createBarChart();
      }
    } else {
      if (!changes.bounds.firstChange) {
        this.sum = 0;
        this.createBarChart();
      }
    }


  }

  ngOnInit() {

    this.createBarChart();
  }

  public createBarChart() {

    Plotly.register(locale);

    esri.imageService({ url: 'https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service/ImageServer' })
      .get('computeHistograms',
        {
          geometryType: 'esriGeometryEnvelope',
          geometry: {
            "xmin": this.bounds.toBBoxString().split(',')[0],
            "ymin": this.bounds.toBBoxString().split(',')[1],
            "xmax": this.bounds.toBBoxString().split(',')[2],
            "ymax": this.bounds.toBBoxString().split(',')[3], "spatialReference": { "wkid": 4326 }
          },
          mosaicRule: { "mosaicMethod": "esriMosaicNorthwest", "where": "OBJECTID=" + this.selIndices[0] }
        }, (error, response) => {
          // .get((this.selIndices[0]) + "/info/histograms", {}, (error, response) => {

          if (error) {
            console.log(error);
          } else {
            let histCounts = [];
            for (let p = 0; p < response.histograms[0].counts.length; p++) {
              histCounts.push(response.histograms[0].counts[p]);
            }
            this.firstIndexvalues = histCounts;
            if (this.firstIndexvalues.length > 1) {
              this.plotChart(this.firstIndexvalues);
            //  this.calculateChange(this.firstIndexvalues);
            }

          }
        });


  }

  public plotChart(firstIndexvalues: number[]) {
    esri.imageService({ url: 'https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service/ImageServer' })
      .get('computeHistograms',
        {
          geometryType: 'esriGeometryEnvelope', geometry: {
            "xmin": this.mapCache.getMap('landcover-map').getBounds().toBBoxString().split(',')[0],
            "ymin": this.mapCache.getMap('landcover-map').getBounds().toBBoxString().split(',')[1],
            "xmax": this.mapCache.getMap('landcover-map').getBounds().toBBoxString().split(',')[2],
            "ymax": this.mapCache.getMap('landcover-map').getBounds().toBBoxString().split(',')[3],
            "spatialReference": { "wkid": 4326 }
          },
          mosaicRule: { "mosaicMethod": "esriMosaicNorthwest", "where": "OBJECTID=" + this.selIndices[1] }
        }, (error, secresponse) => {

          // .get((this.selIndices[1]) + "/info/histograms", {}, (error, secresponse) => {
          if (error) {
            console.log(error);
            return;
          } else {
            let histCounts = [];
            let val = [];
            let names = [];
            let color = [];

            for (let p = 0; p < secresponse.histograms[0].counts.length; p++) {
              histCounts.push(secresponse.histograms[0].counts[p]);
              this.sum = this.sum + secresponse.histograms[0].counts[p];
            }

            if (this.selIndices[0] < this.selIndices[1]) {

              if (firstIndexvalues.length > histCounts.length) {
                for (let i = 1; i < histCounts.length; i++) {
                  if (((firstIndexvalues[i] - histCounts[i]) / this.sum) * 100 != 0 && ((firstIndexvalues[i] - histCounts[i]) / this.sum) * 100 != NaN) {
                    val.push(Math.fround(((firstIndexvalues[i] - histCounts[i]) / (this.sum))) * 100);
                    names.push(categoryVal[i]);
                    color.push(colors[i]);
                    this.noDataValues.push(i.toString());
                  }
                }
                for (let t = histCounts.length; t < firstIndexvalues.length; t++) {
                  val.push(Math.fround(((firstIndexvalues[t]) / (this.sum))) * 100);
                  names.push(categoryVal[t]);
                  color.push(colors[t]);
                }
              } else {
                for (let i = 1; i < firstIndexvalues.length; i++) {
                  if (((firstIndexvalues[i] - histCounts[i]) / this.sum) * 100 != 0 && ((firstIndexvalues[i] - histCounts[i]) / this.sum) * 100 != NaN) {
                    val.push(Math.fround(((firstIndexvalues[i] - histCounts[i]) / (this.sum))) * 100);
                    names.push(categoryVal[i]);
                    color.push(colors[i]);
                  }
                }
                for (let t = firstIndexvalues.length; t < histCounts.length; t++) {
                  val.push(Math.fround(((-histCounts[t]) / (this.sum))) * 100);
                  names.push(categoryVal[t]);
                  color.push(colors[t]);
                }
              }
            }
            else {

              if (this.firstIndexvalues.length > histCounts.length) {
                for (let i = 1; i < histCounts.length; i++) {
                  if (((-firstIndexvalues[i] + histCounts[i]) / this.sum) * 100 != 0 && ((-firstIndexvalues[i] + histCounts[i]) / this.sum) * 100 != NaN) {
                    val.push(Math.fround(((histCounts[i] - firstIndexvalues[i]) / (this.sum))) * 100);
                    names.push(categoryVal[i]);
                    color.push(colors[i]);
                  }
                  for (let t = histCounts.length; t < firstIndexvalues.length; t++) {
                    val.push(Math.fround(((-firstIndexvalues[t]) / (this.sum))) * 100);
                    names.push(categoryVal[t]);
                    color.push(colors[t]);
                  }
                }
              } else {
                for (let i = 1; i < firstIndexvalues.length; i++) {
                  if (((-firstIndexvalues[i] + histCounts[i]) / this.sum) * 100 != 0 && ((-firstIndexvalues[i] + histCounts[i]) / this.sum) * 100 != NaN) {
                    val.push(Math.fround(((histCounts[i] - firstIndexvalues[i]) / (this.sum)))
                      * 100);
                    names.push(categoryVal[i]);
                    color.push(colors[i]);
                  }
                }
                for (let t = firstIndexvalues.length; t < histCounts.length; t++) {
                  val.push(Math.fround(((histCounts[t]) / (this.sum))) * 100);
                  names.push(categoryVal[t]);
                  color.push(colors[t]);
                }
              }
            }
            this.values = val;
            this.labels = names;
            this.colorRgb = color;
            this.maskData.emit(this.noDataValues);
            this.calculateChange(this.values,this.labels,this.colorRgb);
          }

          var data = [{
            type: "bar",
            x: this.values,
            y: this.labels,
            orientation: 'h',
            marker: {
              color: this.colorRgb
            }

          }];

          var layout = {
            width: 600,
            // height: 520,
            margin: { "t": 0, "b": 50, "l": 180, "r": 0 },
            showlegend: false,
          }
          var config = {
            locale: 'de',
            responsive: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian',
              'hoverCompareCartesian', 'toggleSpikelines', 'pan2d', 'zoomOut2d', 'zoomIn2d', 'autoScale2d', 'resetScale2d'],
          }

          Plotly.newPlot(this.barChartIds[0], data, layout, config)
        });

  }

  public calculateChange(val: number[], names:string[],colors: string[]) {
    // esri.imageService({ url: 'https://gis.wacodis.demo.52north.org:6443/arcgis/rest/services/WaCoDiS/EO_WACODIS_DAT_INTRA_LAND_COVER_CLASSIFICATION_Service/ImageServer' })
    // .get('computeHistograms',
    // {
    //   geometryType: 'esriGeometryEnvelope', geometry: {
    //     "xmin": this.mapCache.getMap('landcover-map').getBounds().toBBoxString().split(',')[0],
    //     "ymin": this.mapCache.getMap('landcover-map').getBounds().toBBoxString().split(',')[1],
    //     "xmax": this.mapCache.getMap('landcover-map').getBounds().toBBoxString().split(',')[2],
    //     "ymax": this.mapCache.getMap('landcover-map').getBounds().toBBoxString().split(',')[3],
    //     "spatialReference": { "wkid": 4326 }
    //   },
    //   mosaicRule: { "mosaicMethod": "esriMosaicNorthwest", "where": "OBJECTID=" + this.selIndices[1] }
    // }, (error, secresponse) => {  
    // // .get((this.selIndices[1]) + "/info/histograms", {}, (error, secresponse) => {
    //     if (error) {
    //       console.log(error);
    //       return;
    //     } else {
    //       let histCounts = [];
    //       let val = [];
    //       let names = [];
    //       let color = [];

    //       for (let p = 0; p < secresponse.histograms[0].counts.length; p++) {
    //         histCounts.push(secresponse.histograms[0].counts[p]);
    //         this.absSum = this.absSum + secresponse.histograms[0].counts[p];
    //       }

    //       if (this.selIndices[0] < this.selIndices[1]) {

    //         if (firstIndexvalues.length > histCounts.length) {
    //           for (let i = 1; i < histCounts.length; i++) {
    //             if (((firstIndexvalues[i] - histCounts[i]) / this.sum) * 100 != 0 && ((firstIndexvalues[i] - histCounts[i]) / this.sum) * 100 != NaN) {
    //               val.push(Math.fround(((firstIndexvalues[i] - histCounts[i]) / (this.sum))) * 100 * 1000000);
    //               names.push(categoryVal[i]);
    //               color.push(colors[i]);
    //             }
    //           }
    //           for (let t = histCounts.length; t < firstIndexvalues.length; t++) {
    //             val.push(Math.fround(((firstIndexvalues[t]) / (this.sum))) * 100 * 1000000);
    //             names.push(categoryVal[t]);
    //             color.push(colors[t]);
    //           }
    //         } else {
    //           for (let i = 1; i < firstIndexvalues.length; i++) {
    //             if (((firstIndexvalues[i] - histCounts[i]) / this.sum) * 100 != 0 && ((firstIndexvalues[i] - histCounts[i]) / this.sum) * 100 != NaN) {
    //               val.push(Math.fround(((firstIndexvalues[i] - histCounts[i]) / (this.sum))) * 100 * 1000000);
    //               names.push(categoryVal[i]);
    //               color.push(colors[i]);
    //             }
    //           }
    //           for (let t = firstIndexvalues.length; t < histCounts.length; t++) {
    //             val.push(Math.fround(((-histCounts[t]) / (this.sum))) * 100 * 1000000);
    //             names.push(categoryVal[t]);
    //             color.push(colors[t]);
    //           }
    //         }
    //       }
    //       else {

    //         if (this.firstIndexvalues.length > histCounts.length) {
    //           for (let i = 1; i < histCounts.length; i++) {
    //             if (((-firstIndexvalues[i] + histCounts[i]) / this.sum) * 100 != 0 && ((-firstIndexvalues[i] + histCounts[i]) / this.sum) * 100 != NaN) {
    //               val.push(Math.fround(((histCounts[i] - firstIndexvalues[i]) / (this.sum))) * 100 * 1000000);
    //               names.push(categoryVal[i]);
    //               color.push(colors[i]);
    //             }
    //             for (let t = histCounts.length; t < firstIndexvalues.length; t++) {
    //               val.push(Math.fround(((-firstIndexvalues[t]) / (this.sum))) * 100 * 1000000);
    //               names.push(categoryVal[t]);
    //               color.push(colors[t]);
    //             }
    //           }
    //         } else {
    //           for (let i = 1; i < firstIndexvalues.length; i++) {
    //             if (((-firstIndexvalues[i] + histCounts[i]) / this.sum) * 100 != 0 && ((-firstIndexvalues[i] + histCounts[i]) / this.sum) * 100 != NaN) {
    //               val.push(Math.fround(((histCounts[i] - firstIndexvalues[i]) / (this.sum))) * 100 * 1000000);
    //               names.push(categoryVal[i]);
    //               color.push(colors[i]);
    //             }
    //           }
    //           for (let t = firstIndexvalues.length; t < histCounts.length; t++) {
    //             val.push(Math.fround(((histCounts[t]) / (this.sum))) * 100 * 1000000);
    //             names.push(categoryVal[t]);
    //             color.push(colors[t]);
    //           }
    //         }
    //       }
          this.absValues = val;
          this.absValues.forEach((val,i,arr)=>{
            val/1000000;
          })
          this.absLabels = names;
          this.absColorRgb = colors;
        // }



        var data = [{
          type: "pie",
          values: this.absValues,
          labels: this.absLabels,
          textinfo: 'percent',
          marker: {
            colors: this.colorRgb
          },
          title: 'Absolute Veränderung'
        }];

        var layout = {
          width: 200,
          height: 220,
          margin: { "t": 0, "b": 0, "l": 40, "r": 40 },
          showlegend: false,
        }
        var config = {
          locale: 'de',
          responsive: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian',
            'hoverCompareCartesian', 'toggleSpikelines', 'pan2d', 'zoomOut2d', 'zoomIn2d', 'autoScale2d', 'resetScale2d'],
        }

        Plotly.newPlot(this.barChartIds[1], data, layout, config);
      

  }
}
