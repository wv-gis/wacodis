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

  }
  moveToDiagram(url: string) {
    this.router.navigateByUrl(url);
     
  }

  itemSelected(item: FilteredParameter, index: number){
    if (index < this.i) {
      console.log(this.parameters[index + 1].filterList[0]);
      if(index == 0){
        this.parameters[0].filterList = this.providerList.map((entry) => {
          entry.filter = this.filter;
          return entry;
        });
      }
      else{
        console.log('Label: ' + item.label+ ' Id: ' + item.id);
        item.filterList.splice(index);
       this.parameters[index+1].filterList.splice(index,2);
          this.parameters[(index + 1)].filterList = item.filterList.map((entry) => {
        console.log(this.parameters[index].type);
                   entry.filter[this.parameters[index].type] = entry.itemId;
            return entry;
          });
        
        
       
     console.log(this.parameters[index + 1].filterList[0]);
      }
      
    }
    if(index === this.parameters.length-1){
      this.datasetSelected = true;
    }
    else{
      this.datasetSelected = false;
    }
    this.i = index;
    super.itemSelected(item, index);

  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.parameters[0].filterList = this.providerList.map((entry) => {
      entry.filter = this.filter;
      return entry;
    });
  }

}
