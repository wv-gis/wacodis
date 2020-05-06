import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import Plotly from 'plotly.js-dist';
import * as esri from 'esri-leaflet';
import { locale } from 'src/environments/environment.prod';
import { MapCache } from '@helgoland/map';
import { LatLngBounds, polygon, LatLng } from 'leaflet';

@Component({
  selector: 'wv-copernicus-bar-chart-card',
  templateUrl: './copernicus-bar-chart-card.component.html',
  styleUrls: ['./copernicus-bar-chart-card.component.css']
})

/**
 * Component for visualizing HistogramDataChange between to time steps 
 * as absolute(pie chart) and percentage (barChart) values depending on the mapBounds
 * 
 * @Input parameters:
 *            barChartID: id of the plotly graph to draw
 *            selIndices: Index of the selected layers to calculate the difference in histogram
 *            bounds: Bounds of the shown Map
 *            service: the url of the service to query on
 *            categoryValues: Catgeory Labels for Chart
 *            colors: Colors for Chart
 * @Output parameter:
 *            maskData: pixelvalues which have changed between the selected time steps 
 */
export class CopernicusBarChartCardComponent implements OnInit, OnChanges {

  @Input() barChartIds: string[];
  @Input() selIndices: number[];
  @Input() bounds: LatLngBounds|LatLng[];
  @Input() service: string;
  @Input() categoryValues: string[];
  @Input() colors: string[];

  @Output() maskData: EventEmitter<string[]> = new EventEmitter<string[]>();
  public firstIndexvalues: number[] = [];
  public secIndexvalues: number[] = [];
  public values: number[] = [];
  public labels: string[] = [];
  public colorRgb: string[] = [];
  public sum: number = 0;
  public renderingRule = {};
  public noDataValues: string[] = [];
  public absLabels: string[] = [];
  public absValues: number[] = [];
  public absColorRgb: string[] = [];
  public absSum = 0;
  constructor(private mapCache: MapCache) { }


  /**
   * 
   * @param changes 
   * redraw bar chart if selected Time of Layer has changed or the MapBounds have changed
   */
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.selIndices) {
      if (!changes.selIndices.firstChange) {
        this.sum = 0;
        if (this.bounds instanceof LatLngBounds) {
          let geometryType = 'esriGeometryEnvelope'
          let geometry = {
            "xmin": this.bounds.toBBoxString().split(',')[0],
            "ymin": this.bounds.toBBoxString().split(',')[1],
            "xmax": this.bounds.toBBoxString().split(',')[2],
            "ymax": this.bounds.toBBoxString().split(',')[3], "spatialReference": { "wkid": 4326 }
          }
          this.createBarChart(geometryType, geometry);
        } else {
          let geometryType = 'esriGeometryEnvelope';
          let geometry = {
            "xmin": polygon(this.bounds).getBounds().toBBoxString().split(',')[1],
            "ymin": polygon(this.bounds).getBounds().toBBoxString().split(',')[0],
            "xmax": polygon(this.bounds).getBounds().toBBoxString().split(',')[3],
            "ymax": polygon(this.bounds).getBounds().toBBoxString().split(',')[2], "spatialReference": { "wkid": 4326 }
          };
          this.createBarChart(geometryType, geometry);
        }
      }
    } else {
      if (!changes.bounds.firstChange) {
        this.sum = 0;
        if (this.bounds instanceof LatLngBounds) {
          let geometryType = 'esriGeometryEnvelope'
          let geometry = {
            "xmin": this.bounds.toBBoxString().split(',')[0],
            "ymin": this.bounds.toBBoxString().split(',')[1],
            "xmax": this.bounds.toBBoxString().split(',')[2],
            "ymax": this.bounds.toBBoxString().split(',')[3], "spatialReference": { "wkid": 4326 }
          }
          this.createBarChart(geometryType, geometry);
        } else {
          console.log(this.bounds);
          let geometryType = 'esriGeometryEnvelope';
          let geometry = {
            "xmin": polygon(this.bounds).getBounds().toBBoxString().split(',')[1],
            "ymin": polygon(this.bounds).getBounds().toBBoxString().split(',')[0],
            "xmax": polygon(this.bounds).getBounds().toBBoxString().split(',')[3],
            "ymax": polygon(this.bounds).getBounds().toBBoxString().split(',')[2], "spatialReference": { "wkid": 4326 }
          };
          this.createBarChart(geometryType, geometry);
        }
      }
    }
  }

  ngOnInit() {
    if (this.bounds instanceof LatLngBounds) {
      let geometryType = 'esriGeometryEnvelope'
      let geometry = {
        "xmin": this.bounds.toBBoxString().split(',')[0],
        "ymin": this.bounds.toBBoxString().split(',')[1],
        "xmax": this.bounds.toBBoxString().split(',')[2],
        "ymax": this.bounds.toBBoxString().split(',')[3], "spatialReference": { "wkid": 4326 }
      }
      this.createBarChart(geometryType, geometry);
    }
    else {
      let geometryType = 'esriGeometryEnvelope';
      let geometry = {
        "xmin": polygon(this.bounds).getBounds().toBBoxString().split(',')[1],
        "ymin": polygon(this.bounds).getBounds().toBBoxString().split(',')[0],
        "xmax": polygon(this.bounds).getBounds().toBBoxString().split(',')[3],
        "ymax": polygon(this.bounds).getBounds().toBBoxString().split(',')[2], "spatialReference": { "wkid": 4326 }
      };
      this.createBarChart(geometryType, geometry);
    }
  }

  /**
   * 
   * @param bounds bounds of the MapView
   * request the Pixelvalues of the firstTimestep for the given bounds and then request the values for the second
   * timestep
   */
  public createBarChart(geomType: string, geom: Object) {

    Plotly.register(locale);

    esri.imageService({ url: this.service })
      .get('computeHistograms',
        {
          geometryType: geomType,
          geometry: geom,
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
              this.plotChart(this.firstIndexvalues, geomType, geom);
            }
          }
        });
  }

  /**
   * 
   * @param firstIndexvalues pixelValues of left selected ImageLayer Time
   * @param bbox Bounds of Map View
   * 
   * request the PixelValues for the second timestep based on the given bounds and
   * draw a barChart with percentage Values and trigger the method to draw absolute values as pie Chart 
   */
  public plotChart(firstIndexvalues: number[], geomType: string, geom: Object) {
    esri.imageService({ url: this.service })
      .get('computeHistograms',
        {
          geometryType: geomType, geometry: geom,
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

            // calculate growth and decrease depending on selected Time
            if (this.selIndices[0] < this.selIndices[1]) {

              if (firstIndexvalues.length > histCounts.length) {
                for (let i = 1; i < histCounts.length; i++) {
                  if (((firstIndexvalues[i] - histCounts[i]) / this.sum) * 100 != 0 && ((firstIndexvalues[i] - histCounts[i]) / this.sum) * 100 != NaN) {
                    val.push(Math.fround(((firstIndexvalues[i] - histCounts[i]) / (this.sum))) * 100);
                    names.push(this.categoryValues[i]);
                    color.push(this.colors[i]);
                    this.noDataValues.push(i.toString());
                  }
                }
                for (let t = histCounts.length; t < firstIndexvalues.length; t++) {
                  val.push(Math.fround(((firstIndexvalues[t]) / (this.sum))) * 100);
                  names.push(this.categoryValues[t]);
                  color.push(this.colors[t]);
                }
              } else {
                for (let i = 1; i < firstIndexvalues.length; i++) {
                  if (((firstIndexvalues[i] - histCounts[i]) / this.sum) * 100 != 0 && ((firstIndexvalues[i] - histCounts[i]) / this.sum) * 100 != NaN) {
                    val.push(Math.fround(((firstIndexvalues[i] - histCounts[i]) / (this.sum))) * 100);
                    names.push(this.categoryValues[i]);
                    color.push(this.colors[i]);
                  }
                }
                for (let t = firstIndexvalues.length; t < histCounts.length; t++) {
                  val.push(Math.fround(((-histCounts[t]) / (this.sum))) * 100);
                  names.push(this.categoryValues[t]);
                  color.push(this.colors[t]);
                }
              }
            }
            else {

              if (this.firstIndexvalues.length > histCounts.length) {
                for (let i = 1; i < histCounts.length; i++) {
                  if (((-firstIndexvalues[i] + histCounts[i]) / this.sum) * 100 != 0 && ((-firstIndexvalues[i] + histCounts[i]) / this.sum) * 100 != NaN) {
                    val.push(Math.fround(((histCounts[i] - firstIndexvalues[i]) / (this.sum))) * 100);
                    names.push(this.categoryValues[i]);
                    color.push(this.colors[i]);
                  }
                  for (let t = histCounts.length; t < firstIndexvalues.length; t++) {
                    val.push(Math.fround(((-firstIndexvalues[t]) / (this.sum))) * 100);
                    names.push(this.categoryValues[t]);
                    color.push(this.colors[t]);
                  }
                }
              } else {
                for (let i = 1; i < firstIndexvalues.length; i++) {
                  if (((-firstIndexvalues[i] + histCounts[i]) / this.sum) * 100 != 0 && ((-firstIndexvalues[i] + histCounts[i]) / this.sum) * 100 != NaN) {
                    val.push(Math.fround(((histCounts[i] - firstIndexvalues[i]) / (this.sum)))
                      * 100);
                    names.push(this.categoryValues[i]);
                    color.push(this.colors[i]);
                  }
                }
                for (let t = firstIndexvalues.length; t < histCounts.length; t++) {
                  val.push(Math.fround(((histCounts[t]) / (this.sum))) * 100);
                  names.push(this.categoryValues[t]);
                  color.push(this.colors[t]);
                }
              }
            }
            this.values = val;
            this.labels = names;
            this.colorRgb = color;
            this.maskData.emit(this.noDataValues);
            this.calculateChange(this.values, this.labels, this.colorRgb);
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

  /**
   * 
   * @param val difference in pixels
   * @param names classes of change
   * @param colors colors to draw
   * calculate the absolute change values in km² and draw a pie chart
   */
  public calculateChange(val: number[], names: string[], colors: string[]) {

    this.absValues = val;
    this.absValues.forEach((val, i, arr) => {
      val / 1000000;
    });
    this.absLabels = names;
    this.absColorRgb = colors;

    var data = [{
      type: "pie",
      values: this.absValues,
      labels: this.absLabels,
      textinfo: 'percent',
      marker: {
        colors: this.colorRgb
      },
      title: 'Anteil an absoluter Veränderung (km²)'
    }];

    var layout = {
      width: 372,
      height: 220,
      margin: { "t": 20, "b": 20, "l": 40, "r": 40 },
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
    // Plotly.newPlot('PEuwChart', data, layout, config);    
    // Plotly.newPlot('PEowChart', data, layout, config);       
  }
}
