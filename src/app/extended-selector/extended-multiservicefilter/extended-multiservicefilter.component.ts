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


    public selectedItems = [];
    public endpoint: string = this.endpoint;
    public i = 0;

    constructor(protected datasetApiInterface: DatasetApiInterface, protected translate: TranslateService) {
        super(datasetApiInterface, translate);
    }
    onSelectItem(item: FilteredParameter) {
        super.onSelectItem(item);
        console.log(this.filterList[this.filterList.length - 1].filter);
        this.selectedItems.push(item.label);


    }
    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.selectedItems.splice(0,this.selectedItems.length-1);
    }
}