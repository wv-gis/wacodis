import { Component, ChangeDetectorRef } from '@angular/core';
import { HighlightOutput } from '@helgoland/d3';
import { HoveringStyle, D3PlotOptions } from '@helgoland/d3';
import { Timespan, DatasetOptions, DatasetService, ColorService, LocalStorage } from '@helgoland/core';


/**
 * Component to depict the selected datasets in a diagram
 */
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
        yAxisStepper: true,

    };
    public selectedIds: string[] = [];
    public datasetOptionsMultiple: Map<string, DatasetOptions> = new Map<string, DatasetOptions>();
    public isActive = false;
    public reloadForDatasets = [];
    public overviewOptions: D3PlotOptions = {
        overview: true,
        yaxis: false,
        showTimeLabel: false
    };

    constructor(private cdr: ChangeDetectorRef, private dataEmitService: DatasetService<DatasetOptions>,
        private color: ColorService, private localStorage: LocalStorage) {
        if (dataEmitService !== undefined && dataEmitService.hasDatasets()) {
            for (let k = 0; k < dataEmitService.datasetIds.length; k++) {
                this.datasetIdsMultiple.push(dataEmitService.datasetIds[k]);
            }
            if (localStorage.load('time') !== null) {
                let storeTimespan = localStorage.load('time') as Timespan;
                // this.timespan = new Timespan( Math.round(storeTimespan.from),Math.round(storeTimespan.to));
            }
            try {
               dataEmitService.datasetOptions.forEach((options) => {
                    this.colors.push(options.color);
                    this.datasetIdsMultiple.forEach((entry, i) => {
                        const option = new DatasetOptions(entry, this.colors[i]);
                        option.generalize = true;
                        option.pointRadius = 2;
                        this.datasetOptionsMultiple.set(entry, option);
                    });
                });
            } catch (e) {
                console.log('Error in TimeseriesView ' + e);
            }
        } else {
            console.log('No Dataservice available');
        }
    }



    /**
     * if another timespan is selcted redraw diagram and set new timespan
     * @param timespan new selected timespan
     */
    public timespanChanged(timespan: Timespan) {
        this.timespan = timespan;
        this.localStorage.save('time', this.timespan);
    }

    /**
     * draw overview graph and respond to changes in timespan of overview graph
     * @param loading 
     */
    public onOverviewLoading(loading: boolean) {
        this.overviewLoading = loading;
        this.cdr.detectChanges();
    }
    /**
     * set selected timeseries for styling purposes
     * @param event 
     */
    public select(event: string[]) {
        this.selectedIds = event;
    }

    /**
     * open timeseries dataset tree or hide and redraw graph to fit the screen size
     */
    public change() {
        if (this.isActive) {
            this.isActive = !this.isActive;
            this.refreshData();
            return false;
        }
        else {
            this.isActive = !this.isActive;
            this.refreshData();
            return true;
        }
    }

    /**
     * remove the selected dataset from every view list and refresh diagram
     * @param id 
     */
    public removeDataset(id: string) {
        this.dataEmitService.removeDataset(id);
        const datasetIdx = this.datasetIdsMultiple.indexOf(id);
        if (datasetIdx > -1) {
            this.datasetIdsMultiple.splice(datasetIdx, 1);
        }
        this.refreshData();
    }

    /**
     * highlight selected Object
     * @param highlightObject 
     */
    public highlightChanged(highlightObject: HighlightOutput) {
        this.highlightedTime = new Date(highlightObject.timestamp);
    }

    /**
     * refresh selected or all datasets
     * @param id id of dataset to refresh
     */
    public refreshData(id?: number) {
        if (id) {

            this.reloadForDatasets = [this.datasetIdsMultiple[id]];
        }
        else {
            this.reloadForDatasets = [this.datasetIdsMultiple[0]];
        }
    }

    /**
     * change options of dataset such as color or axis rendering
     * @param options 
     */
    public updateOptions(options: any[]) {
        this.datasetOptionsMultiple.set(options[1].toString(), options[0]);
        this.refreshData(this.datasetIdsMultiple.indexOf(options[1]));
    }
}


