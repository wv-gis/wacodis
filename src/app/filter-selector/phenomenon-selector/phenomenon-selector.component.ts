import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { Phenomenon, DatasetApi, FilteredProvider, Provider } from "@helgoland/core";
import { ListSelectorParameter } from "@helgoland/selector";

@Component(
    {
        selector: 'wv-phenomenon-selector',
        templateUrl: './phenomenon-selector.component.html',
        styleUrls: ['./phenomenon-selector.component.css']
    })


export class PhenomenonSelectorComponent implements OnChanges {

    
    @Input()
    public apiUrl: string;
    @Output()
    selectedPhenomenon: EventEmitter<Phenomenon> = new EventEmitter<Phenomenon>();
    @Output()
    stationFilter = new EventEmitter();

    selectedProviderList: Provider[]=[];
   

    ngOnChanges(changes: SimpleChanges): void {
      this.selectedProviderList.push({
          id: '1',
          url: this.apiUrl
      })
    }
    onPhenomenonSelected(phenomenon: Phenomenon) {
        this.selectedPhenomenon.emit(phenomenon);
        console.log(this.apiUrl);
    }

    removeFilter() {
        this.stationFilter.emit();
    }
}