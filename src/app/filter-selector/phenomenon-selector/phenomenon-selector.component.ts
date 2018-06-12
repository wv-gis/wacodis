import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { Phenomenon, DatasetApi, FilteredProvider, Provider, DatasetApiInterface } from "@helgoland/core";
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
   id: string;
   isFirst = true;

    ngOnChanges(changes: SimpleChanges): void {
        if(this.isFirst){
            this.id = '1';
            this.isFirst= false;
        }

      this.selectedProviderList.push({
          id: this.id,
          url: changes.apiUrl.currentValue,
          
      })
      this.apiUrl = changes.apiUrl.currentValue;
      
      console.log(this.apiUrl);
    }
    onPhenomenonSelected(phenomenon: Phenomenon) {
        this.selectedPhenomenon.emit(phenomenon);
    }

    removeFilter() {
        this.stationFilter.emit();
    }
}