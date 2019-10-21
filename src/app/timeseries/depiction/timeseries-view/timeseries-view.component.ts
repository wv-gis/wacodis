import { Component, ChangeDetectorRef,OnChanges } from '@angular/core';
import { HighlightOutput } from '@helgoland/d3';
import { HoveringStyle, D3PlotOptions } from '@helgoland/d3';
import { Timespan, DatasetOptions, DatasetService, ReferenceValueOption, ColorService, LocalStorage } from '@helgoland/core';



@Component({
    selector: 'wv-timeseries-view',
    templateUrl: './timeseries-view.component.html',
    styleUrls: ['./timeseries-view.component.scss']
})
export class TimeseriesViewComponent {
   
  

    public datasetIdsMultiple: string[] = [];
    public colors: string[] = [];
    public overviewLoading: boolean;
    public timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());
    public timelist = [this.timespan.from, this.timespan.to];
    //   public hoverstyle: HoveringStyle;
    public highlightedTime: Date;

    public diagramOptionsD3: D3PlotOptions = {
        togglePanZoom: true,
        showReferenceValues: true,
        generalizeAllways: true,
        hoverable: true,
        hoverStyle: HoveringStyle.line,
        copyright: { label: "Daten ohne Gewähr", positionX: 'right', positionY: 'bottom' },
        yaxis: true,
        groupYaxis: true,
        showTimeLabel: false,

    };
    public selectedIds: string[] = [];
    public datasetOptionsMultiple: Map<string, DatasetOptions> = new Map<string, DatasetOptions>();
    public isActive = false;
    public reloadForDatasets = [];

    constructor(private cdr: ChangeDetectorRef, private dataEmitService: DatasetService<DatasetOptions>, 
        private color: ColorService, private localStorage: LocalStorage) {
        if (dataEmitService !== undefined && dataEmitService.hasDatasets()) {
            for (let k = 0; k < dataEmitService.datasetIds.length; k++) {
                this.datasetIdsMultiple.push(dataEmitService.datasetIds[k]);
             
            }
            if (localStorage.load('time')!== null) {
                let storeTimespan = localStorage.load('time') as Timespan;
                // this.timespan = new Timespan( Math.round(storeTimespan.from),Math.round(storeTimespan.to));
           
            }
            try {
                
                dataEmitService.datasetOptions.forEach((options) => {
                    this.colors.push(options.color);
                    // console.log('Color OPtion: ' + options.color);
                    this.datasetIdsMultiple.forEach((entry, i) => {
                        const option = new DatasetOptions(entry, this.colors[i]);
                        option.generalize = true;
                        option.pointRadius = 2;
                        this.datasetOptionsMultiple.set(entry, option);
    
                    });
                });
            }catch(e){
                console.log('Error in TimeseriesView '+ e);
            }
          
        }else{
            console.log('No Dataservice available');
        }
     
       
    }
 
    public overviewOptions: D3PlotOptions = {
        overview: true,
        yaxis: false,
        showTimeLabel: false
    };

    public timespanChanged(timespan: Timespan) {
        this.timespan = timespan;
        this.localStorage.save('time',this.timespan);
    }

    public onOverviewLoading(loading: boolean) {
        this.overviewLoading = loading;
        this.cdr.detectChanges();
    }
    public select(event: string[]) {
        this.selectedIds = event;
    }

    public change() {
        if (this.isActive) {
            this.isActive = !this.isActive;
            this.refreshData();
            return false;
        }
        else {
            this.isActive = !this.isActive;
            this.refreshData();
            // this.isActive = true;
            return true;
        }
    }

    public removeDataset(id: string) {
        this.dataEmitService.removeDataset(id);
        const datasetIdx = this.datasetIdsMultiple.indexOf(id);
        if (datasetIdx > -1) {
            this.datasetIdsMultiple.splice(datasetIdx, 1);
        }
        this.refreshData();
    }

    public highlightChanged(highlightObject: HighlightOutput) {
        this.highlightedTime = new Date(highlightObject.timestamp);
    }
    public refreshData(id?: number) {
        if (id) {

            this.reloadForDatasets = [this.datasetIdsMultiple[id]];
        }
        else {
            this.reloadForDatasets = [this.datasetIdsMultiple[0]];
        }
    }
    public updateOptions(options: any[]) {
        // public updateOptions(options: Map<string, DatasetOptions>) {
        // this.dataEmitService.datasetOptions.forEach((opt)=>{
        //     this.datasetIdsMultiple.forEach((entry)=>{
        //         this.datasetOptionsMultiple.set(entry, opt);
        //     })
        // })
        // this.datasetIdsMultiple.forEach((ent)=>{
        //     this.datasetOptionsMultiple.set(ent, options.get(ent));
        //     console.log('Received Colors: ' + options.get(ent).color);
        // });
        this.datasetOptionsMultiple.set(options[1].toString(), options[0]);
        // console.log(options[1].toString());
        this.refreshData(this.datasetIdsMultiple.indexOf(options[1]));
    }
}


