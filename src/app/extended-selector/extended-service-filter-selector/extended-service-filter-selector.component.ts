import {Component, Input, SimpleChanges} from '@angular/core';
import { MultiServiceFilterSelectorComponent, FilteredParameter } from '@helgoland/selector';
import { DatasetApiInterface } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'wv-extended-service-filter-selector',
    templateUrl: './extended-service-filter-selector.component.html',
    styleUrls: ['./extended-service-filter-selector.component.scss']
})

export class ExtendedServiceFilterSelectorComponent extends MultiServiceFilterSelectorComponent{

    public selectionID: string = null;
    constructor(protected datasetApiInterface: DatasetApiInterface,protected translate: TranslateService){
        super(datasetApiInterface, translate);
    }

    onSelectItem(item: FilteredParameter ){
        super.onSelectItem(item);
        this.selectionID = item.id;
       
    }
    removeFilter(){
        this.onItemSelected.emit();
        this.selectionID = null;
    }
}