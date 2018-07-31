import { Component, Input, EventEmitter, Output } from "@angular/core";
import { Timespan, DatasetOptions, DatasetService } from "@helgoland/core";
import { DatasetEmitService } from "../../services/dataset-emit.service";

@Component({
    selector: 'wv-dataset-menu',
    templateUrl: './dataset-menu.component.html',
    styleUrls: ['./dataset-menu.component.scss']
})

export class DatasetMenuComponent {

    @Input()
    timespan: Timespan;
    @Input()
    datasetOptionsMultiple: Map<string, DatasetOptions>;
    @Output()
    changeSelectedIdList: EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output()
    changeSelectedDataset: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    changeTimespan: EventEmitter<Timespan> = new EventEmitter<Timespan>();
    @Output()
    clicked: EventEmitter<boolean> = new EventEmitter<boolean>();

    isActive = true;
    selectedIds: string[] = [];
    datasetIdsMultiple: string[] = [];

    constructor(private dataEmitService: DatasetService<DatasetOptions>) {
        if (dataEmitService !== undefined && dataEmitService.hasDatasets()) {
            for (let k = 0; k < dataEmitService.datasetIds.length; k++) {
                this.datasetIdsMultiple.push(dataEmitService.datasetIds[k]);

            }
        }

    }

    public selectDataset(dataset: boolean, index: string) {
        if (dataset) {
            this.selectedIds.push(index);
        } else {
            this.selectedIds.splice(this.selectedIds.findIndex((entry) => entry === index), 1);
        }
        this.changeSelectedIdList.emit(this.selectedIds);
    }

    public isSelected(id: string) {
        return this.selectedIds.indexOf(id) > -1;
    }

    change() {
        if (this.isActive) {
            this.isActive = false;
            this.clicked.emit(false);
            return false;
        }
        else {
            this.isActive = true;
            this.clicked.emit(true);
            return true;
        }
    }
    public changeDate(date: Date) {

        if (date.getTime() < this.timespan.from) {
            this.timespan.from = date.getTime();
            this.timespan.to = date.getTime() + 100000000;
        } else {
            this.timespan.to = date.getTime();
            this.timespan.from = date.getTime() - 100000000;
        }
        this.changeTimespan.emit(new Timespan(this.timespan.from, this.timespan.to));
    }

    public removeDataset(id: string) {
        this.changeSelectedDataset.emit(id);

        const datasetIdx = this.datasetIdsMultiple.indexOf(id);
        if (datasetIdx > -1) {
            this.datasetIdsMultiple.splice(datasetIdx, 1);
        }
    }
}