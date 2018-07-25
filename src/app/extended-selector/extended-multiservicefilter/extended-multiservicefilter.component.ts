import { Component, SimpleChanges } from '@angular/core';
import { MultiServiceFilterSelectorComponent, FilteredParameter } from '@helgoland/selector';
import { DatasetApiInterface } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'wv-extended-multiservicefilter',
    templateUrl: './extended-multiservicefilter.component.html',
    styleUrls: ['./extended-multiservicefilter.component.scss']
})

export class ExtendedMultiservicefilterComponent extends MultiServiceFilterSelectorComponent {

    
    public selectedItems =[];
    public endpoint: string = this.endpoint;

    constructor(protected datasetApiInterface: DatasetApiInterface,protected translate: TranslateService){
        super(datasetApiInterface, translate);
    }
    onSelectItem(item: FilteredParameter) {
        super.onSelectItem(item);
        this.selectedItems.push(item.label);
      
        
    }
    ngOnChanges(changes: SimpleChanges){
        super.ngOnChanges(changes);
        // console.log('OnChanges MultiService');
    }

}