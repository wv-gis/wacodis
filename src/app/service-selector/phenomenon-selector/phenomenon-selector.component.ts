import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Phenomenon } from "@helgoland/core";

@Component(
{
    selector: 'wv-phenomenon-selector',
    templateUrl: './phenomenon-selector.component.html',
    styleUrls: ['./phenomenon-selector.component.css']
})


export class PhenomenonSelectorComponent{

@Input()
public apiUrl: string;
@Output()
selectedPhenomenon: EventEmitter<Phenomenon> = new EventEmitter<Phenomenon>();

onPhenomenonSelected(phenomenon: Phenomenon){
this.selectedPhenomenon.emit(phenomenon);
}


}