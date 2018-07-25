import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { DatasetOptions, Timespan, DatasetService } from '@helgoland/core';
import { D3TimeseriesGraphComponent, D3PlotOptions } from '@helgoland/d3';
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
    public isActive = false;


    constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute, private dataEmitService: DatasetService<DatasetOptions>) {
        if (dataEmitService !== undefined && dataEmitService.hasDatasets()) {
            for (let k = 0; k < dataEmitService.datasetIds.length; k++) {
                this.datasetIdsMultiple.push(dataEmitService.datasetIds[k]);
            }
        }

        dataEmitService.datasetOptions.forEach((option) => {
            console.log(option.color)
            this.colors.push(option.color);
            this.datasetIdsMultiple.forEach((entry, i) => {
                this.datasetOptionsMultiple.set(entry, new DatasetOptions(entry, this.colors[i]));
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
            // this.diagramOptionsD3.yaxis =document.getElementById('#diagram').getBoundingClientRect().width;
            this.isActive = false;


            return false;
        }
        else {
            // this.diagramOptionsD3.yaxis =document.getElementById('#diagram').getBoundingClientRect().width;
            this.isActive = true;
            return true;
        }
    }

    public removeDataset(id: string) {
        const datasetIdx = this.datasetIdsMultiple.indexOf(id);
        if (datasetIdx > -1) {
            this.datasetIdsMultiple.splice(datasetIdx, 1);
            this.datasetOptionsMultiple.delete(id);
        }
        this.dataEmitService.removeDataset(id);
    }

}
