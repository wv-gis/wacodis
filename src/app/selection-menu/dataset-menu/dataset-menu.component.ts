import { Component, Input, EventEmitter, Output } from "@angular/core";
import { Timespan, DatasetOptions, DatasetService, ColorService } from "@helgoland/core";
import { DatasetEmitService } from "../../services/dataset-emit.service";
import { StyleModificationComponent } from "../../component-views/style-modification/style-modification.component";
import { MatDialog } from "@angular/material";

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

    public datasetOptions: Map<string, DatasetOptions> = new Map();
    isActive = true;
    selectedIds: string[] = [];
    datasetIdsMultiple: string[] = [];
    highlightId: string;

    constructor(private dataEmitService: DatasetService<DatasetOptions>, private color: ColorService, private dialog: MatDialog) {
        if (dataEmitService !== undefined && dataEmitService.hasDatasets()) {
            for (let k = 0; k < dataEmitService.datasetIds.length; k++) {
                this.datasetIdsMultiple.push(dataEmitService.datasetIds[k]);

            }
        }
        this.datasetIdsMultiple.forEach((entry) => { 
            const option = new DatasetOptions(entry, this.color.getColor()); 
             option.generalize = true; 
             option.autoRangeSelection = true;
            this.datasetOptions.set(entry, option); 
         }); 
            
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
    public highlight(selected: boolean, id: string){
        this.highlightId = id;
    }
    public editOption(option: DatasetOptions){
        this.dialog.open(StyleModificationComponent, {
            data: option
        });
        console.log('Edit Option: ' + JSON.stringify(option));
    }
    public updateOptions(option: DatasetOptions){
        console.log('updateOptions ' + JSON.stringify(option));
    }
    public showGeometry(geometry: GeoJSON.GeoJsonObject){
        console.log('Geometry: ' + JSON.stringify(geometry));
    }
}