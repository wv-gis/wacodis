import { Component, SimpleChanges } from '@angular/core';
import { MultiServiceFilterSelectorComponent, FilteredParameter } from '@helgoland/selector';

@Component({
    selector: 'wv-extended-multiservicefilter',
    templateUrl: './extended-multiservicefilter.component.html',
    styleUrls: ['./extended-multiservicefilter.component.scss']
})

export class ExtendedMultiservicefilterComponent extends MultiServiceFilterSelectorComponent {

    
    public selectedItems =[];
    public endpoint: string = this.endpoint;
    onSelectItem(item: FilteredParameter) {
        super.onSelectItem(item);
        this.selectedItems.push(item.label);
      
        
    }
    ngOnChanges(changes: SimpleChanges){
        super.ngOnChanges(changes);
    }

}