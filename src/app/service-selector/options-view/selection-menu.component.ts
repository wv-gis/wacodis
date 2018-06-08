import { Component,Input, Output, EventEmitter } from '@angular/core';
import { Service } from '@helgoland/core';



@Component({
  selector: 'wv-selection-menu',
  templateUrl: './selection-menu.component.html',
  styleUrls: ['./selection-menu.component.css']
})

export class SelectionMenuComponent {
    // @Input()
    // label: string;
    public id: string;
    public label= 'Wupperverband Zeitreihen Dienst';
    @Output()
    selectedProvider = new EventEmitter<Service>();
    @Output()
    selectedFilter = new EventEmitter<String>();

    emitProviderUrl(service: Service){
        this.selectedProvider.emit(service);
        this.label=service.label;
    }
    onFilterselected(id: string){
        console.log('Event ' + id);
        this.selectedFilter.emit(id);
    }
}