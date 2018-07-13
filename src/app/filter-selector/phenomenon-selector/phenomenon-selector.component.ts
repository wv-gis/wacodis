import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { Phenomenon, Provider, Service } from "@helgoland/core";

@Component(
    {
        selector: 'wv-phenomenon-selector',
        templateUrl: './phenomenon-selector.component.html',
        styleUrls: ['./phenomenon-selector.component.css']
    })


export class PhenomenonSelectorComponent implements  OnChanges {

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
    public selectedService: Service;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        
        if(this.provider){
            this.selectedService = this.provider;
            this.selectedProviderList = [];
            this.selectedProviderList.push({
                id: this.selectedService.id,
                url: this.selectedService.apiUrl,
            })
        }
        

        //  if(this.isFirst && !this.selectedService){
        //     this.isFirst = false;
        //     this.selectedProviderList.push({
        //         id: '1',
        //         url: 'http://www.fluggs.de/sos2/api/v1/',
        //     })
        // }
        // else{
          
        // }
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
            return false;
        }
        else {          
            this.isActive = true;
            return true;
        }
    }

}