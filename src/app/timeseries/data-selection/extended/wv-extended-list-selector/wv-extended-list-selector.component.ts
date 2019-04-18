import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ListSelectorComponent, FilteredParameter, ListSelectorService } from '@helgoland/selector';
import { DatasetApiMapping, DatasetApiInterface, FilteredProvider } from '@helgoland/core';
import { Router } from '@angular/router';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';

@Component({
  selector: 'wv-extended-list-selector',
  templateUrl: './wv-extended-list-selector.component.html',
  styleUrls: ['./wv-extended-list-selector.component.scss']
})
export class WvExtendedListSelectorComponent extends ListSelectorComponent implements OnInit {


  public i: number = 0;
  public datasetSelected: boolean = false;
  public selectedProviderUrl: string = '';

  constructor(protected listSelectorService: ListSelectorService, protected apiInterface: DatasetApiInterface,
    protected apiMapping: DatasetApiMapping, protected router: Router, private selProv: SelectedProviderService) {
    super(listSelectorService, apiInterface, apiMapping);
    // this.listSelectorService.cache.clear();

  }

  ngOnInit(): void {
  }
  moveToDiagram(url: string) {
    this.router.navigateByUrl(url);

  }

  newItemSelected(item: FilteredParameter, index: number) {

    if (index < this.i) {
      for (let k = index + 1; k < this.parameters.length; k++) {
        this.parameters[k].filterList = item.filterList.map((entry) => {
          entry.filter = {};
          return entry;
        });
      }
    }
    else if (index == 0 && this.i == 0) {
      if (!this.datasetSelected) {
        for (let k = index + 2; k < this.parameters.length; k++) {
          this.parameters[k].filterList = item.filterList.map((entry) => {
            entry.filter = {};
            return entry;
          });
        }
      }
    }
    // else if(index == 1 && this.i == 1){

    //   if(!this.datasetSelected){
    //     for (let k = index+1 ; k < this.parameters.length; k++) {
    //       console.log(JSON.stringify(this.parameters[k].filterList)); 
    //     }
    //   }
    // }
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
    this.selProv.service$.subscribe((res) => {
      this.selectedProviderUrl = res.url;
    });
    this.parameters[0].filterList = this.providerList.map((entry) => {
      entry.filter = this.filter;
      entry.url = this.selectedProviderUrl;
      return entry;
    });
  }
}
