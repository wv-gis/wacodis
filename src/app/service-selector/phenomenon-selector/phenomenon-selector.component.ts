import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Phenomenon } from "@helgoland/core";

@Component(
{
    selector: 'wv-phenomenon-selector',
    templateUrl: './phenomenon-selector.component.html',
})


export class PhenomenonSelectorComponent{

@Input()
public apiUrl: string;
@Output()
selectedPhenomenon: EventEmitter<Phenomenon> = new EventEmitter<Phenomenon>();

onPhenomenonSelected(phenomenon: Phenomenon){
this.selectedPhenomenon.emit(phenomenon);
}


url = this.apiUrl;

}