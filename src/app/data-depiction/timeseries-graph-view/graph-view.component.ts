import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatasetOptions, Timespan } from '@helgoland/core';
import { D3PlotOptions } from '@helgoland/d3';
import { ListSelectorService } from '@helgoland/selector';
import { DatasetEmitService } from '../../filter-selector/filter';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'wv-graph-view',
    templateUrl: './graph-view.component.html',
    styleUrls: ['./graph-view.component.scss']
})
export class GraphViewComponent {

    // These variables define the links for accessing the datasets and in which colors they are styled.
    public datasetIdsMultiple = ['http://www.fluggs.de/sos2/api/v1/__53', 'http://www.fluggs.de/sos2/api/v1/__72'];
    public colors= []; //= ['#123456', '#FF0000'];
    public overviewLoading: boolean;
    // The timespan will be set to the last 28 hours which is calculated in milliseconds (milliseconds*1000 = 100000000).
    public timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());
    public timelist = [this.timespan.from, this.timespan.to];
    // public timespan: Timespan;
    // These are the plotting options. The boolen of 'togglePanZoom' is set to 'true' to pan the graph.
    public diagramOptionsD3: D3PlotOptions = {
        togglePanZoom: false,
        showReferenceValues: false,
        generalizeAllways: true
    };
   
    // 'selectedIds' determines the graphs that are visualized with a larger stroke-width. This can be set by clicking on the y-axis.
    public selectedIds: string[] = [];
    public datasetOptionsMultiple: Map<string, DatasetOptions> = new Map();

    constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) {
        //  __emitService.dataEmit.subscribe(data => console.log(data));
       
        this.route.queryParams.subscribe(params => {
            console.log('Paramter: ' + params.parameters);
            this.datasetIdsMultiple.push(params.datasetIdsMultiple);
            // this.timespan = new Timespan(params.firstValueTime, params.lastValueTime);
        });
         this.createColors();

        this.datasetIdsMultiple.forEach((entry, i) => {
            this.datasetOptionsMultiple.set(entry, new DatasetOptions(entry, this.colors[i]));
            console.log('DatasetIds: ' + this.colors[i]);
        });

       

    }
    private createColors(){
        for(let i = 0; i < this.datasetIdsMultiple.length; i++){
            this.colors.push("rgb("+ Math.floor(Math.random() * 255) + ","+ Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
        }
        
    }
    public overviewOptions: D3PlotOptions = {
        generalizeAllways: true
    };
    // This function changes the timespan of the graph which is needed for panning (and zooming).
    public timespanChanged(timespan: Timespan) {
        this.timespan = timespan;
    }
    public selectDataset(selected: boolean, id: string) {
        if (selected) {
            this.selectedIds.push(id);
        } else {
            this.selectedIds.splice(this.selectedIds.findIndex((entry) => entry === id), 1);
        }
    }
    public isSelected(id: string) {
        return this.selectedIds.indexOf(id) > -1;
    }
    public onOverviewLoading(loading: boolean) {
        this.overviewLoading = loading;
        this.cdr.detectChanges();
    }
}
