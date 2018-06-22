import { Component, OnInit } from '@angular/core';
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

  constructor(protected listSelectorService: ListSelectorService,
    protected apiInterface: DatasetApiInterface,
    protected apiMapping: DatasetApiMapping, protected router: Router) {
    super(listSelectorService, apiInterface, apiMapping);

  }
  moveToDiagram(url: string) {
    this.router.navigateByUrl(url);
  }

  itemSelected(item: FilteredParameter, index: number) {
    // TODO: heruasfinden was neu gesetzt werden muss um neue Abfrage starten zu können
    if (index < this.i) {
      this.parameters[index + 1].filterList = item.filterList.map((entry) => {
        entry.filter[this.parameters[index].type] = entry.itemId;
        console.log('Entry: ' + entry.filter.phenomenon);
        return entry;
        
    });
      this.parameters[index].headerAddition = '';
    }
    else{
      super.itemSelected(item, index);
    }
    
    this.i = index;
    
   
    
  }

}
