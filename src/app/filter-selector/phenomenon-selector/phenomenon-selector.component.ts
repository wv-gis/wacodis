import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { Phenomenon, DatasetApi, FilteredProvider, Provider, DatasetApiInterface, Service } from "@helgoland/core";
import { ListSelectorParameter } from "@helgoland/selector";

@Component(
    {
        selector: 'wv-phenomenon-selector',
        templateUrl: './phenomenon-selector.component.html',
        styleUrls: ['./phenomenon-selector.component.css']
    })


export class PhenomenonSelectorComponent implements OnChanges {


    @Input()
    public provider: Service;
    @Output()
    selectedPhenomenon: EventEmitter<Phenomenon> = new EventEmitter<Phenomenon>();
    @Output()
    stationFilter = new EventEmitter();

    selectedProviderList: Provider[] = [];
    id: string;
    isFirst = true;
    // isVisible = true;
    isActive = true;
    public selectionId: string = null;

    ngOnChanges(changes: SimpleChanges): void {
  
        if(this.isFirst && !this.provider){
            this.isFirst = false;
            this.selectedProviderList.push({
                id: '1',
                url: 'http://www.fluggs.de/sos2/api/v1/',
            })
        }
        else{
            this.selectedProviderList = [];
            this.selectedProviderList.push({
                id: this.provider.id,
                url: this.provider.apiUrl,
            })
        }
    }
    onPhenomenonSelected(phenomenon: Phenomenon) {
        this.selectedPhenomenon.emit(phenomenon);
        this.selectionId = phenomenon.id;
    }

    removeFilter() {
        this.stationFilter.emit();
        this.selectionId = null;
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