import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { DatasetOptions, Timespan, DatasetService } from '@helgoland/core';
import { D3TimeseriesGraphComponent, D3PlotOptions, HoveringStyle } from '@helgoland/d3';
import { ActivatedRoute } from '@angular/router';
import { DatasetEmitService } from '../../services/dataset-emit.service';
import { HighlightOutput } from '../../../../node_modules/@helgoland/d3/lib/d3-timeseries-graph/d3-timeseries-graph.component';


@Component({
    selector: 'wv-graph-view',
    templateUrl: './graph-view.component.html',
    styleUrls: ['./graph-view.component.scss']
})
export class GraphViewComponent {

    public datasetIdsMultiple = [];// ['http://www.fluggs.de/sos2/api/v1/__53', 'http://www.fluggs.de/sos2/api/v1/__72'];
    public colors = []; //= ['#123456', '#FF0000'];
    public overviewLoading: boolean;
    public timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());
    public timelist = [this.timespan.from, this.timespan.to];
    public hoverstyle: HoveringStyle;
    public highlightedTime: Date;
    public link: string ='http://www.google.de';
    public diagramOptionsD3: D3PlotOptions = {
        togglePanZoom: false,
        showReferenceValues: true,
        generalizeAllways: false,
        hoverable: true,
        hoverStyle: HoveringStyle.point,
        copyright: { label: "Daten ohne Gewähr", positionX: 'right', positionY: 'bottom' },
        yaxis: true,
        groupYaxis: true,
        showTimeLabel: false,

    };
    public selectedIds: string[] = [];
    public datasetOptionsMultiple: Map<string, DatasetOptions> = new Map();
    public isActive = false;
    public reloadForDatasets = [];

    constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute, private dataEmitService: DatasetService<DatasetOptions>) {
        if (dataEmitService !== undefined && dataEmitService.hasDatasets()) {
            for (let k = 0; k < dataEmitService.datasetIds.length; k++) {
                this.datasetIdsMultiple.push(dataEmitService.datasetIds[k]);
            }
        }

        dataEmitService.datasetOptions.forEach((option) => {
            this.colors.push(option.color);
            this.datasetIdsMultiple.forEach((entry, i) => {
                const option = new DatasetOptions(entry, this.colors[i]);
                option.generalize = true;
                option.lineWidth = 0;
                option.pointRadius = 3;
                option.yAxisRange = {min: 1, max: 2};
                this.datasetOptionsMultiple.set(entry,option );
            });
        });

    }


    private createColors() {
        for (let i = 0; i < this.datasetIdsMultiple.length; i++) {
            this.colors.push("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
        }
    }

    public overviewOptions: D3PlotOptions = {
        overview: true,
        yaxis: false,
    };

    public timespanChanged(timespan: Timespan) {
        this.timespan = timespan;
    }

    // public selectDataset(selected: boolean, id: string) {
    //     if (selected) {
    //         this.selectedIds.push(id);
    //     } else {
    //         this.selectedIds.splice(this.selectedIds.findIndex((entry) => entry === id), 1);
    //     }
    // }

    // public isSelected(id: string) {
    //     return this.selectedIds.indexOf(id) > -1;
    // }

    public onOverviewLoading(loading: boolean) {
        this.overviewLoading = loading;
        this.cdr.detectChanges();
    }
    public select(event: string[]) {
        this.selectedIds = event;
    }

    public change() {
        if (this.isActive) {
            this.isActive = false;
            // const time = new Timespan(this.timespan.from - 1, this.timespan.to);
            this.refreshData();
            // this.timespan = time;
            return false;
        }
        else {
            this.isActive = false;
            // const time = new Timespan(this.timespan.from + 1, this.timespan.to);
            // this.timespan = time;
            this.refreshData();
            this.isActive = true;
            return true;
        }
    }

    public removeDataset(id: string) {
        const datasetIdx = this.datasetIdsMultiple.indexOf(id);
        if (datasetIdx > -1) {
            this.datasetIdsMultiple.splice(datasetIdx, 1);
            this.datasetIdsMultiple.sort();
            this.datasetOptionsMultiple.delete(id);
        }
        this.dataEmitService.removeDataset(id);
    }
    public groupYaxisChanged() {
        this.diagramOptionsD3.groupYaxis = !this.diagramOptionsD3.groupYaxis;
    }
    public changeHovering(id: string){
        this.hoverstyle = HoveringStyle[id];
        this.diagramOptionsD3.hoverStyle = this.hoverstyle;
    }
    public highlightChanged(highlightObject: HighlightOutput){
        this.highlightedTime = new Date(highlightObject.timestamp);
    }
    public refreshData(){
        this.reloadForDatasets = [this.datasetIdsMultiple[0]];
    }
}
