import { Component, Input, EventEmitter, Output } from "@angular/core";
import { Timespan, DatasetOptions } from "@helgoland/core";
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

    isActive = false;
    selectedIds: string[] = [];
    datasetIdsMultiple: string[] = [];

    constructor(private dataEmitService: DatasetEmitService) {
        if (dataEmitService !== undefined && dataEmitService.hasDatasets()) {
            for (let k = 0; k < dataEmitService.datasetIds.length; k++) {
                this.datasetIdsMultiple.push(dataEmitService.datasetIds[k]);

            }
        }

    }

    selectDataset(dataset: boolean, index: string) {
        if (dataset) {
            this.selectedIds.push(index);
        } else {
            this.selectedIds.splice(this.selectedIds.findIndex((entry) => entry === index), 1);
        }
        this.changeSelectedIdList.emit(this.selectedIds);
    }
    isSelected(id: string) {
        return this.selectedIds.indexOf(id) > -1;
    }
    change() {
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