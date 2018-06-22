import { Component } from '@angular/core';
import { MultiServiceFilterSelectorComponent, FilteredParameter } from '@helgoland/selector';

@Component({
    selector: 'wv-extended-multiservicefilter',
    templateUrl: './extended-multiservicefilter.component.html',
    styleUrls: ['./extended-multiservicefilter.component.scss']
})

export class ExtendedMultiservicefilterComponent extends MultiServiceFilterSelectorComponent {

    public selected: string = null;

    onSelectItem(item: FilteredParameter) {
        super.onSelectItem(item);
        this.selected = item.id;
    }

}