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

    constructor(protected datasetApiInterface: DatasetApiInterface, protected translate: TranslateService) {
        super(datasetApiInterface, translate);
    }
    onSelectItem(item: FilteredParameter) {
        super.onSelectItem(item);
        this.selectedItems.push(item.label);

        // this.items.forEach((elem) => {
        //   elem.filterList.forEach((entry) =>  console.log('Label Changes ' + entry.filter['phenomenon']))
           
        // });
        // item.filterList.forEach((entry) => console.log(entry.filter['phenomenon']));
    }
    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);       
        this.filterList.forEach((entry) => {
         
        });

    }
}