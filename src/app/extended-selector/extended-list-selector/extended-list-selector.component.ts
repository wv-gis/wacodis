import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ListSelectorComponent, ListSelectorService, FilteredParameter } from '@helgoland/selector';
import { DatasetApiInterface, DatasetApiMapping } from '@helgoland/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wv-extended-list-selector',
  templateUrl: './extended-list-selector.component.html',
  styleUrls: ['./extended-list-selector.component.scss']
})
export class ExtendedListSelectorComponent extends ListSelectorComponent {


  public i: number = 0;
  public datasetSelected: boolean = false;

  constructor(protected listSelectorService: ListSelectorService,
    protected apiInterface: DatasetApiInterface,
    protected apiMapping: DatasetApiMapping, protected router: Router) {
    super(listSelectorService, apiInterface, apiMapping);
    this.listSelectorService.cache.clear();
  }
  moveToDiagram(url: string) {
    this.router.navigateByUrl(url);

  }

  itemSelected(item: FilteredParameter, index: number) {
console.log(item.filterList);
    if (index < this.i) {
        for (let k = index + 1; k < this.parameters.length; k++) {
          this.parameters[k].filterList = item.filterList.map((entry) => {
            entry.filter = {};
            return entry;
          });
        }
    }   
      super.itemSelected(item, index);
    
    if (index === this.parameters.length - 1) {
      this.datasetSelected = true;
    }
    else {
      this.datasetSelected = false;
    }
    this.i = index;

  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.parameters[0].filterList = this.providerList.map((entry) => {
      entry.filter = this.filter;
      return entry;
    });
  }

}
