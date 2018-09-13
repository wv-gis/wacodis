import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { Phenomenon, Provider, Service } from "@helgoland/core";
import { MapCache } from "@helgoland/map";

@Component(
    {
        selector: 'wv-phenomenon-selector',
        templateUrl: './phenomenon-selector.component.html',
        styleUrls: ['./phenomenon-selector.component.css']
    })


export class PhenomenonSelectorComponent implements  OnChanges {

    @Input()
    provider: Service;
    @Output()
    selectedPhenomenon: EventEmitter<Phenomenon> = new EventEmitter<Phenomenon>();
    @Output()
    stationFilter = new EventEmitter();

    selectedProviderList: Provider[];// = [];
    id: string;
    isFirst = true;
    isActive = true;
    public selectionId: string = null;
    public selectedService: Service;

    constructor( protected mapCache : MapCache) { }

    ngOnChanges(changes: SimpleChanges): void {
        
        if(this.provider){
            this.selectedService = this.provider;
            this.selectedProviderList = [];
            this.selectedProviderList.push({
                id: this.selectedService.id,
                url: this.selectedService.apiUrl,
            })
        }
       
    }
 
     onPhenomenonSelected(phenomenon: Phenomenon) {
        if (!phenomenon) {
            this.stationFilter.emit();
        }
        else {
            this.selectedPhenomenon.emit(phenomenon);
            this.selectionId = phenomenon.id;
        }

    }
    public change() {
        if (this.isActive) {
            this.isActive = false;
            if(document.getElementById('mainMap')!== undefined){
                document.getElementById('mainMap').setAttribute('style',' right: 0px;');
            }
          this.mapCache.getMap('map').invalidateSize();
          this.mapCache.getMap('map').setView(this.mapCache.getMap('map').getCenter(), this.mapCache.getMap('map').getZoom());
            return false;
        }
        else {          
            this.isActive = true;
            if(document.getElementById('mainMap')!== undefined){
                document.getElementById('mainMap').setAttribute('style','right: 400px;');
            }
            this.mapCache.getMap('map').invalidateSize();
            this.mapCache.getMap('map').setView(this.mapCache.getMap('map').getCenter(), this.mapCache.getMap('map').getZoom());
            return true;
        }
    }

}