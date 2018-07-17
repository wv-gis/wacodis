import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { DatasetOptions, Timespan } from '@helgoland/core';
import { D3PlotOptions } from '@helgoland/d3';
import { ActivatedRoute } from '@angular/router';
import { DatasetEmitService } from '../../services/dataset-emit.service';



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
    public diagramOptionsD3: D3PlotOptions = {
        togglePanZoom: false,
        showReferenceValues: false,
        generalizeAllways: true,
    };
    public selectedIds: string[] = [];
    public datasetOptionsMultiple: Map<string, DatasetOptions> = new Map();
    public isActive = true;


    constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute, private dataEmitService: DatasetEmitService) {
               if (dataEmitService !== undefined && dataEmitService.hasDatasets()) {
            for (let k = 0; k < dataEmitService.datasetIds.length; k++) {
                this.datasetIdsMultiple.push(dataEmitService.datasetIds[k]);
                console.log(dataEmitService.datasetIds[0]);
                // dataEmitService.datasetOptions.forEach((entry) =>this.colors.push(entry.color) )
                // this.datasetOptionsMultiple.set(dataEmitService.datasetIds[k],this.colors[k] );

            }


        }
       

        this.createColors();

        this.datasetIdsMultiple.forEach((entry, i) => {
            this.datasetOptionsMultiple.set(entry, new DatasetOptions(entry, this.colors[i]));
        });
    }


    private createColors() {
        for (let i = 0; i < this.datasetIdsMultiple.length; i++) {
            this.colors.push("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
        }
    }

    public overviewOptions: D3PlotOptions = {
        generalizeAllways: true
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
            return false;
        }
        else {
            this.isActive = true;
            return true;
        }
    }

}
