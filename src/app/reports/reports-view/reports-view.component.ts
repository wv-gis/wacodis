import { Component, OnInit, ViewChild, ElementRef,  OnDestroy, Input } from '@angular/core';
import {  Timespan,    SettingsService,   DatasetType, HelgolandServicesConnector } from '@helgoland/core';
import { ExtendedSettings } from 'src/app/settings/settings.service';
import { locale } from '../../../environments/environment';
import Plotly from 'plotly.js-dist';
import { D3TimeFormatLocaleService } from '@helgoland/d3';

export interface LineLayout {
  color: string;
  width: number;
  dash: string;
  mode: string;
}

export class ReferenceValues {
  referenceId: string;
  label: string;   
}
const width = 1040;
const height = 750;
@Component({
  selector: 'wv-reports-view',
  templateUrl: './reports-view.component.html',
  styleUrls: ['./reports-view.component.css']
})
export class ReportsViewComponent implements OnInit, OnDestroy {

  @ViewChild('d3Graph', { static: false })
  public plotlydiv: ElementRef;

  @Input() serviceUrl: string;
  @Input() timespans: Timespan[];
  @Input() reservoirId: number;
  @Input() damLabel: string;

  public plot;
  public timeseries: any;
  public plotData: any[] = [];
  public plotRainData: any[] = [];
  public loading: boolean = false;
  public loadingCounter = 0;
  public levelCounter = 0;
  public reservoirs: any;
  public refValues: ReferenceValues[] = [];
  public timeseriesId: string = '';
  public compSeriesId: string = '';
  public rainSeriesId: string = '';
  public refColors: string[] = ['rgb(255,0, 0)', 'rgb(0,111,100)', 'rgb(0,200,100)'];
  public compSerColors: string[] = ['rgb(0,100,0)', 'rgb(102,205,0)', 'rgb(205,205,0)', 'rgb(255,130,71)', 'rgb(160,82,45)'];
  public index: number = -1;
  public sortValues: [number,number][] = [];

  constructor(private datasetApi: HelgolandServicesConnector, private configService: SettingsService<ExtendedSettings>, private d3translate: D3TimeFormatLocaleService) {
    // this.reservoirs = WvSettingsConfigService.WV_CONFIG_SETTINGS.reservoirs;
    this.reservoirs = this.configService.getSettings().reservoirs;

  }

  ngOnInit() {

    this.timeseriesId = this.reservoirs[this.reservoirId].graph.seriesId;
    if (this.reservoirs[this.reservoirId].graph.rainSeriesID) {
      this.rainSeriesId = this.reservoirs[this.reservoirId].graph.rainSeriesID;
    }
    else {
      this.rainSeriesId = '';
    }

    if (this.reservoirs[this.reservoirId].graph.referenceValues) {
      this.refValues = this.reservoirs[this.reservoirId].graph.referenceValues;
    } else {
      this.refValues = undefined;
    }

    if (this.reservoirs[this.reservoirId].graph.compSeriesId) {
      this.compSeriesId = this.reservoirs[this.reservoirId].graph.compSeriesId;
    } else {
      this.compSeriesId = '';
    }
    this.plotGraph();
  }


  public errorOnLoading(error: any) {
    this.loadingCounter--;
    console.error(error);
  }

  public getLoading(): void {
    Plotly.register(locale);

    this.loadingCounter--;
    if (this.loadingCounter === 0) {
      if (this.index != -1) {
        let levelData = {
          x: [this.sortValues[this.index][0]],
          y: [this.sortValues[this.index][1]],
          type: 'scatter',
          mode: 'markers',
          name: "[" + (this.index + 1) + " von " + this.sortValues.length + "] Rangfolge der jahreszeitlichen Füllstände",
          text: ['Rang ' + (this.index + 1) + " von " + this.sortValues.length],
          textfont: {
            family: 'Arial',
            size: 0
          },
          textposition: 'right center',
          marker: {
            color: 'rgb(247, 79, 232)',
            size: 8
          }
        };
        this.plotData.push(levelData);
      }
      this.loading = !this.loading;
      let layout = {
        title: 'Speicherinhalt ' + this.damLabel,
        yaxis: {
          rangemode: 'tozero',
          title: 'Mio m³',
          zeroline: true,
          showline: true,
          fixedrange: true
        },
        margin: {
          pad: 0,
        },
        yaxis2: {
          title: 'Tagessumme [mm]',
          showline: true,
          side: 'right',
          overlaying: 'y',
          showgrid: false,
          rangemode: 'tozero',
          fixedrange: true
        },
        xaxis: {
          showgrid: true,
          fixedrange: true,
        },
        legend: { "orientation": "h" },
        height: 500,
      };


      let config = {
        toImageButtonOptions: {
          format: 'png',
          height: height,
          width: width,
        },
        locale: 'de',
        responsive: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian',
          'hoverCompareCartesian', 'toggleSpikelines', 'pan2d', 'zoomOut2d', 'zoomIn2d', 'autoScale2d', 'resetScale2d'],
      };
      this.plot = Plotly.newPlot(this.plotlydiv.nativeElement, this.plotData, layout, config);
    }
  }

  public plotGraph() {
    if (this.loadingCounter === 0) { this.loading = !this.loading; };

    // if (this.timeseriesId) {
    //   this.loadingCounter++;
      // this.datasetApi.getTimeseriesData(this.serviceUrl, [this.timeseriesId.split('__')[1]], this.timespans[0]).subscribe((data) => {
      //   this.defineData(data, this.timeseriesId, this.timespans[0]);
      // }, (err) => this.errorOnLoading(err), () => this.getLoading());

      this.datasetApi.getDatasets(this.serviceUrl, { type: DatasetType.Timeseries ,
        expanded: true}).subscribe((data) => {
        data.forEach((val, i, arr) => {
          if(val.id == this.timeseriesId.split('__')[1]){
            this.loadingCounter++;
            this.datasetApi.getDatasetData(val, this.timespans[0]).subscribe(d => {
                this.defineData(d.values, this.timeseriesId, this.timespans[0]);
            },(err) => this.errorOnLoading(err), () => this.getLoading());
            for (let p = 0; p < 31; p++) {
              this.loadingCounter ++;
              this.datasetApi.getDatasetData(val,new Timespan(new Date(new Date(val.lastValue.timestamp).getFullYear() - p,
              new Date(val.lastValue.timestamp).getMonth(), new Date(val.lastValue.timestamp).getDate(), new Date(val.lastValue.timestamp).getHours()),
              new Date(new Date(val.lastValue.timestamp).getFullYear() - p, new Date(val.lastValue.timestamp).getMonth(), new Date(val.lastValue.timestamp).getDate(), 
              new Date(val.lastValue.timestamp).getHours()))
                ).subscribe((res) => {
                    if (res.values[0] != undefined) {
                      this.defineLevel(res.values[0], val.lastValue.timestamp);
                    }
                }, (err) => this.errorOnLoading(err), () => this.getLoading());
            }
            val.referenceValues.forEach((ref,i,refVals)=>{
              this.datasetApi.getDataset(this.serviceUrl + "__"+this.refValues[i].referenceId.split('__')[1],{type: DatasetType.Timeseries}).subscribe((re)=>{
                this.loadingCounter++;
                this.datasetApi.getDatasetData(re,this.timespans[0]).subscribe(refData=>{
                  this.defineData(refData.values, ref.referenceValueId, this.timespans[0], i, this.refValues[i]);
                },(err) => this.errorOnLoading(err), () => this.getLoading());
              }); 
            });
          }
          if (this.compSeriesId != '') {
            if(val.id==this.compSeriesId.split('__')[1]){
              for (let j = 1; j < this.timespans.length; j++) {
                this.loadingCounter++;
                this.datasetApi.getDatasetData(val, this.timespans[j]).subscribe(d => {
                  this.defineData(d.values, this.compSeriesId, this.timespans[j], j - 1);
                },(err) => this.errorOnLoading(err), () => this.getLoading());
              }
            }
          }
          if (this.rainSeriesId != '') {
           if(val.id==this.rainSeriesId.split('__')[1]){
            this.loadingCounter++;
              this.datasetApi.getDatasetData(val, this.timespans[0]).subscribe(d => {
                this.defineData(d.values, this.rainSeriesId, this.timespans[0]);

              },(err) => this.errorOnLoading(err), () => this.getLoading());
            }
          }     
        });
      });
    // }
    // if (this.compSeriesId != '') {
    //   for (let j = 1; j < this.timespans.length; j++) {
    //     this.loadingCounter++;
    //     this.datasetApi.getTimeseriesData(this.serviceUrl, [this.compSeriesId.split('__')[1]], this.timespans[j]).subscribe((data) => {
    //       this.defineData(data, this.compSeriesId, this.timespans[j], j - 1);
    //     }, (err) => this.errorOnLoading(err), () => this.getLoading());
    //   }
    // }

    // if (this.refValues != undefined) {
    //   for (let b = 0; b < this.refValues.length; b++) {
    //     this.loadingCounter++;
    //     this.datasetApi.getTimeseriesData(this.serviceUrl, [this.refValues[b].referenceId.split('__')[1]], this.timespans[0]).subscribe((refVal) => {
    //       this.defineData(refVal, this.refValues[b].referenceId, this.timespans[0], b, this.refValues[b]);
    //     }, (err) => this.errorOnLoading(err), () => this.getLoading());
    //   }
    // }

    // if (this.rainSeriesId != '') {
    //   this.loadingCounter++;
    //   this.datasetApi.getTimeseriesData(this.serviceUrl, [this.rainSeriesId.split('__')[1]], this.timespans[0]).subscribe((res) => {
    //     this.defineData(res, this.rainSeriesId, this.timespans[0]);
    //   }, (err) => this.errorOnLoading(err), () => this.getLoading());
    // }

    // this.datasetApi.getSingleTimeseries(this.timeseriesId.split('__')[1], this.serviceUrl).subscribe(ts=>{
    //   for (let p = 0; p < 31; p++) {
    //     this.loadingCounter ++;
    //     this.datasetApi.getTimeseriesData(this.serviceUrl, [this.timeseriesId.split('__')[1]], new Timespan(new Date(new Date(ts.lastValue.timestamp).getFullYear() - p,
    //     new Date(ts.lastValue.timestamp).getMonth(), new Date(ts.lastValue.timestamp).getDate(), new Date(ts.lastValue.timestamp).getHours()),
    //     new Date(new Date(ts.lastValue.timestamp).getFullYear() - p, new Date(ts.lastValue.timestamp).getMonth(), new Date(ts.lastValue.timestamp).getDate(), 
    //     new Date(ts.lastValue.timestamp).getHours()))
    //       ).subscribe((res) => {
    //         res.forEach((dat) => {
    //           if (dat.data[0] != undefined) {
    //             this.defineLevel(dat.data[0], ts.lastValue.timestamp);
    //           }
    //         });
    //       }, (err) => this.errorOnLoading(err), () => this.getLoading());
    //   }
    // });
  }

  public defineLevel(values: [number,number], lastTime: number) {
    this.sortValues.push(values);
    this.sortValues.sort(function (a, b) { return b[1] - a[1]; });
    this.index = this.sortValues.findIndex((val) => {
      return val[0] === new Date(new Date(lastTime).getFullYear(), new Date(lastTime).getMonth(),
        new Date(lastTime).getDate(), new Date(lastTime).getHours()).getTime();
    });
  }

  public defineData(data: [number,number][], id: string, timespan: Timespan, counter?: number, referValues?: ReferenceValues) {
    if (id == this.timeseriesId) {
      let intervals = [];
      let values = [];
      for (let i = 0; i < data.length; i++) {
        // for (let k = 0; k < data[i].data.length; k++) {
          if (new Date(data[i][0]).getFullYear() === new Date(timespan.from).getFullYear()) {
            intervals.push(new Date(new Date().getFullYear() - 1, new Date(data[i][0]).getMonth(), new Date(data[i][0]).getDate()));
          }
          else if (new Date(data[i][0]).getFullYear() === new Date(timespan.to).getFullYear()
            && new Date(data[i][0]).getMonth() <= new Date(timespan.to).getMonth()) {
            intervals.push(new Date(new Date().getFullYear() + 1, new Date(data[i][0]).getMonth(), new Date(data[i][0]).getDate()));
          }
          else {
            intervals.push(new Date(new Date().getFullYear(), new Date(data[i][0]).getMonth(), new Date(data[i][0]).getDate()));
          }
          values.push(data[i][1]);
        // }
      }
      this.addDataToPlot(intervals, values, timespan, { color: 'darkblue', width: 3, dash: 'solid', mode: 'scatter' });
    }

    if (referValues) {
      let refInterval = [];
      let currentRefValues = [];
      let color = '';

      for (let k = 0; k < data.length; k++) {
        // for (let i = 0; i < data[k].data.length; i++) {
          if (referValues.label === 'Vollstau') {
            if (k === 0 ) {
              refInterval.push(new Date(new Date().getFullYear() - 1, new Date(timespan.from).getMonth(), new Date(timespan.from).getDate()));
              refInterval.push(new Date(new Date().getFullYear() + 1, new Date(timespan.to).getMonth(), new Date(timespan.to).getDate()));
            }
            color = this.refColors[1];
          }
          else {
            if (new Date(data[k][0]).getFullYear() === new Date(timespan.from).getFullYear()) {
              refInterval.push(new Date(new Date().getFullYear() - 1, new Date(data[k][0]).getMonth(), new Date(data[k][0]).getDate()));
            }
            else if (new Date(data[k][0]).getFullYear() === new Date(timespan.to).getFullYear()
              && new Date(data[k][0]).getMonth() <= new Date(timespan.to).getMonth()) {
              refInterval.push(new Date(new Date().getFullYear() + 1, new Date(data[k][0]).getMonth(), new Date(data[k][0]).getDate()));
            }
            else if (new Date(data[k][0]).getFullYear() === new Date(timespan.to).getFullYear()
              && new Date(data[k][0]).getMonth() > new Date(timespan.to).getMonth()) {
              // do nothing
            }
            else {
              refInterval.push(new Date(new Date().getFullYear(), new Date(data[k][0]).getMonth(), new Date(data[k][0]).getDate()));
            }
            color = this.refColors[counter]
          }
          currentRefValues.push(data[k][1]);
        // }
      }
      this.addDataToPlot(refInterval, currentRefValues, timespan, { color: color, width: 1, dash: 'solid', mode: 'scatter' }, referValues.label);
    }

    if (id == this.compSeriesId) {
      let compIntervals = [];
      let compValues = [];

      for (let i = 0; i < data.length; i++) {
        // for (let k = 0; k < data[i].data.length; k++) {
          if (new Date(data[i][0]).getFullYear() === new Date(timespan.from).getFullYear()) {
            compIntervals.push(new Date(new Date().getFullYear() - 1, new Date(data[i][0]).getMonth(), new Date(data[i][0]).getDate()));
          }
          else if (new Date(data[i][0]).getFullYear() === new Date(timespan.to).getFullYear()
            && new Date(data[i][0]).getMonth() <= new Date(timespan.to).getMonth()) {
            compIntervals.push(new Date(new Date().getFullYear() + 1, new Date(data[i][0]).getMonth(), new Date(data[i][0]).getDate()));
          }
          else if (new Date(data[i][0]).getFullYear() === new Date(timespan.to).getFullYear()
            && new Date(data[i][0]).getMonth() > new Date(timespan.to).getMonth()) {
          }
          else {
            compIntervals.push(new Date(new Date().getFullYear(), new Date(data[i][0]).getMonth(), new Date(data[i][0]).getDate()));
          }
          compValues.push(data[i][1]);
        }
      // }
      this.addDataToPlot(compIntervals, compValues, timespan, { color: this.compSerColors[counter], width: 2, dash: 'dashdot', mode: 'scatter' });
    }

    // if (id == this.rainSeriesId) {
    //   let rainInterval = [];
    //   let rainValues = [];
    //   for (let k = 0; k < data.length; k++) {
    //     for (let l = 0; l < data[k].data.length; l++) {
    //       if (new Date(data[k].data[l].timestamp).getFullYear() === new Date(timespan.from).getFullYear()) {
    //         rainInterval.push(new Date(new Date().getFullYear() - 1, new Date(data[k].data[l].timestamp).getMonth(), new Date(data[k].data[l].timestamp).getDate()));
    //       }
    //       else if (new Date(data[k].data[l].timestamp).getFullYear() === new Date(timespan.to).getFullYear()) {
    //         rainInterval.push(new Date(new Date().getFullYear() + 1, new Date(data[k].data[l].timestamp).getMonth(), new Date(data[k].data[l].timestamp).getDate()));
    //       }
    //       else {
    //         rainInterval.push(new Date(new Date().getFullYear(), new Date(data[k].data[l].timestamp).getMonth(), new Date(data[k].data[l].timestamp).getDate()));
    //       }
    //       rainValues.push(data[k].data[l].value);
    //     }
    //   }
    //   this.addDataToPlot(rainInterval, rainValues, timespan, { width: 1, color: 'lightblue', dash: 'solid', mode: 'bar' }, 'Niederschlag');
    // }
      if (id == this.rainSeriesId) {
      let rainInterval = [];
      let rainValues = [];
      for (let k = 0; k < data.length; k++) {
        // for (let l = 0; l < data[k].data.length; l++) {
          if (new Date(data[k][0]).getFullYear() === new Date(timespan.from).getFullYear()) {
            rainInterval.push(new Date(new Date().getFullYear() - 1, new Date(data[k][0]).getMonth(), new Date(data[k][0]).getDate()));
          }
          else if (new Date(data[k][0]).getFullYear() === new Date(timespan.to).getFullYear()) {
            rainInterval.push(new Date(new Date().getFullYear() + 1, new Date(data[k][0]).getMonth(), new Date(data[k][0]).getDate()));
          }
          else {
            rainInterval.push(new Date(new Date().getFullYear(), new Date(data[k][0]).getMonth(), new Date(data[k][0]).getDate()));
          }
          rainValues.push(data[k][1]);
        // }
      }
      this.addDataToPlot(rainInterval, rainValues, timespan, { width: 1, color: 'lightblue', dash: 'solid', mode: 'bar' }, 'Niederschlag');
    }
  }

  public addDataToPlot(interval: Date[], values: number[], time: Timespan, lineLayout: LineLayout, label?: string) {

    if (lineLayout.color != 'lightblue') {
      if (lineLayout.color != 'darkblue') {
        let lineTimeseries = {
          x: interval,
          y: values,
          type: lineLayout.mode,
          mode: 'lines',
          name: new Date(time.from).getFullYear() + "/" + (new Date(time.to).getFullYear() - 1) + ' Vergleichsjahre ',
          line: {
            color: lineLayout.color,
            width: lineLayout.width,
            dash: lineLayout.dash,
          },
        };
        if (label) {
          lineTimeseries.name = label;
        }
        this.plotData.push(lineTimeseries);
      } else {
        let textTo: string;
        if (new Date(interval[interval.length - 1]).toLocaleDateString() == new Date().toLocaleDateString()) {
          textTo = 'heute';
        }
        else {
          // textTo =new Date(interval[interval.length-1]).getDate()+'.'+ (new Date(interval[interval.length-1]).getMonth()+1) + '.' + 
          // new Date(interval[interval.length-1]).getFullYear();
          textTo = "letzter akt. Wert";
        }
        let currentTimeseries = {
          x: interval,
          y: values,
          type: lineLayout.mode,
          mode: 'lines',
          name: " [" + values[values.length - 1] + " Mio m³]" + 'Speicherinhalt: ' + new Date(time.from).getFullYear() + ' - ' + textTo,
          line: {
            color: lineLayout.color,
            width: lineLayout.width,
            dash: lineLayout.dash,
          },
        };
        this.plotData.push(currentTimeseries);
      }

    }
    else {
      let compTimeseries = {
        x: interval,
        y: values,
        type: lineLayout.mode,
        name: label + ' ' + new Date(time.from).getFullYear() + " - gestern",
        marker: {
          color: lineLayout.color,
          opacity: 0.7,
        },
        yaxis: 'y2',
      };
      this.plotData.push(compTimeseries);

    }
  }


  public ngOnDestroy() {
    this.plotData = [];

  }


}
