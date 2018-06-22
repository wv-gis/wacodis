import {Component, Input, SimpleChanges} from '@angular/core';
import { MultiServiceFilterSelectorComponent, FilteredParameter } from '@helgoland/selector';


@Component({
    selector: 'wv-extended-service-filter-selector',
    templateUrl: './extended-service-filter-selector.component.html',
    styleUrls: ['./extended-service-filter-selector.component.scss']
})

export class ExtendedServiceFilterSelectorComponent extends MultiServiceFilterSelectorComponent{

    public selectionID: string = null;

    onSelectItem(item: FilteredParameter ){
        super.onSelectItem(item);
        this.selectionID = item.id;
       
    }
    removeFilter(){
        this.onItemSelected.emit();
        this.selectionID = null;
    }
}