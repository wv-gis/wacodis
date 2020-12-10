import { Component,  EventEmitter, Input, Output } from '@angular/core';
import { DatasetOptions, Timespan, DatasetService, ColorService,HelgolandServicesConnector, DatasetType } from '@helgoland/core';
import { HoveringStyle, D3PlotOptions } from '@helgoland/d3';
import * as L from 'leaflet';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';
export var STYLE_DATA: DatasetOptions;
@Component({
    selector: 'wv-timeseries-legend',
    templateUrl: './timeseries-legend.component.html',
    styleUrls: ['./timeseries-legend.component.scss']
})
export class TimeseriesLegendComponent {

    @Input()
    public timespan: Timespan;
    @Input()
    public diagramOptions: D3PlotOptions;
    @Input()
    public datasetOptionsMultiple: Map<string, DatasetOptions>;
    @Output()
    changeSelectedIdList: EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output()
    changeSelectedDataset: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    changeTimespan: EventEmitter<Timespan> = new EventEmitter<Timespan>();
    @Output()
    clicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    updatedOptions: EventEmitter<any[]> = new EventEmitter<any[]>()


    public datasetOptions: Map<string, DatasetOptions> = new Map<string, DatasetOptions>();
    isActive = true;
    selectedIds: string[] = [];
    datasetIdsMultiple: string[] = [];
    highlightId: string;
    public reloadForDatasets = [];
    public hoverstyle: HoveringStyle;
    public highlightedTime: Date;
    public mymap: L.Map;
    public marker: L.Marker;
    public display = 'hidden';
    public pick = 'hidden';
    public stationGeometries: GeoJSON.GeoJsonObject[] = [];
    public stationLabels: string[] = [];
    public editOptions: DatasetOptions;
    public selectedProviderUrl: string = '';
 

    constructor(private dataEmitService: DatasetService<DatasetOptions>,private selProv: SelectedProviderService, private color: ColorService, private datasetapi: HelgolandServicesConnector) {
        this.selProv.getSelectedProvider().subscribe((res) => {
            this.selectedProviderUrl = res.url;
        });
       
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
            this.isActive = !this.isActive;
            this.clicked.emit(false);
            return false;
        }
        else {
            this.isActive = !this.isActive;
            this.clicked.emit(true);
            return true;
        }
    }
    public changeDate(date: Date) {

        if (date.getTime() < this.timespan.from) {
            this.timespan.from = date.getTime() - 3600000;
            this.timespan.to = date.getTime() + 86400000;
        } else {
            this.timespan.to = date.getTime() + 3600000;
            this.timespan.from = date.getTime() - 86400000;
        }
        this.changeTimespan.emit(new Timespan(this.timespan.from, this.timespan.to));
    }

    public removeDataset(id: string) {
        this.changeSelectedDataset.emit(id);
        const datasetIdx = this.datasetIdsMultiple.indexOf(id);
        if (datasetIdx > -1) {
            this.datasetIdsMultiple.splice(datasetIdx, 1);
        }
        this.refreshData();
    }
    public highlight(selected: boolean, id: string) {
        this.highlightId = id;
    }
    public editOption(option: DatasetOptions) {
        this.editOptions = new DatasetOptions(option.internalId, option.color);
   
        this.pick = 'visible';
    }
    public updateOptions(option: DatasetOptions, id: string) {

            if(option.showReferenceValues.length>0){
                this.datasetapi.getDataset(id, {type: DatasetType.Timeseries}).subscribe((res) => {
                    res.referenceValues.forEach((re) => {
    
                        option.yAxisRange = { min: 0, max: re.lastValue.value + 10 };
                  
                    });
                });
    
                this.datasetOptions.set(id, option);
                this.datasetOptionsMultiple.set(id, option);
                this.updatedOptions.emit([option, id]);
                this.dataEmitService.updateDatasetOptions(option, id);
                this.refreshData();
            }
            else{
                option.autoRangeSelection = true;
                option.yAxisRange= undefined;
                this.dataEmitService.updateDatasetOptions(option, id);
                this.refreshData();
            }
     
      


    }



    public showGeometry(geometry: GeoJSON.GeoJsonObject) {
        this.display = 'visible';
        this.mymap = L.map('geomMapId').setView([geometry['coordinates'][1], geometry['coordinates'][0]], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
            maxZoom: 16,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            className: 'Open Street Map'
        }).addTo(this.mymap);
        this.marker = L.marker([geometry['coordinates'][1], geometry['coordinates'][0]]).addTo(this.mymap);
    }
    public onCloseHandled() {
        this.display = 'hidden';
        this.mymap.remove();

    }

    public onOk() {
        this.pick = 'hidden';
    }

    public showOriginal() {
        for (let i = 0; i < this.selectedIds.length; i++) {
            this.datasetOptions.get(this.selectedIds[i]).generalize = !this.datasetOptions.get(this.selectedIds[i]).generalize;
        }
        this.diagramOptions.generalizeAllways = !this.diagramOptions.generalizeAllways;
        this.refreshData();
    }
    public refreshData() {
        for (let i = 0; i < this.datasetIdsMultiple.length; i++) {
            this.reloadForDatasets.push(this.datasetIdsMultiple[i]);
        }

    }
    public groupYaxisChanged() {
        for (let i = 0; i < this.selectedIds.length; i++) {
            this.datasetOptions.get(this.selectedIds[i]).separateYAxis = !this.datasetOptions.get(this.selectedIds[i]).separateYAxis;
        }
        this.diagramOptions.groupYaxis = !this.diagramOptions.groupYaxis;
        this.refreshData();
    }
    public changeHovering(id: string) {
        this.hoverstyle = HoveringStyle[id];
        this.diagramOptions.hoverStyle = this.hoverstyle;
    }

    public showAllStations() {
        this.display = 'visible';
        this.mymap = L.map('geomMapId').setView([51.157611, 7.263204], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
            maxZoom: 16,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            className: 'Open Street Map'
        }).addTo(this.mymap);

        for (let k = 0; k < this.datasetIdsMultiple.length; k++) {
            this.datasetapi.getPlatform(this.datasetIdsMultiple[k],this.selectedProviderUrl).subscribe((dataset) => {
  
                    this.stationGeometries.push(dataset.geometry);
                    this.stationLabels.push(dataset.label)
                

                for (let i = 0; i < this.stationGeometries.length; i++) {
                    L.marker([this.stationGeometries[i]['coordinates'][1], this.stationGeometries[i]['coordinates'][0]]).addTo(this.mymap);
                    L.popup().setLatLng([this.stationGeometries[i]['coordinates'][1], this.stationGeometries[i]['coordinates'][0]])
                        .setContent(`<div> ${this.stationLabels[i]} </div>`).addTo(this.mymap);
                }

            });
        }

    }
    public newOptions(options: DatasetOptions) {
    

        options.pointRadius = 2;
        this.updatedOptions.emit([options, options.internalId]);
        this.dataEmitService.updateDatasetOptions(options, options.internalId);
        this.refreshData();
    }
}
