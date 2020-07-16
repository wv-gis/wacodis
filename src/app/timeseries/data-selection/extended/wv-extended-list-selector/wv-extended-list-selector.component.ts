import { Component, SimpleChanges } from '@angular/core';
import { ListSelectorComponent, FilteredParameter, ListSelectorService } from '@helgoland/selector';
import { HelgolandServicesConnector } from '@helgoland/core';
import { Router } from '@angular/router';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';

/**
 * Extends ListSelectorComponent for stylingOPtions and routing of diagram 
 */
@Component({
  selector: 'wv-extended-list-selector',
  templateUrl: './wv-extended-list-selector.component.html',
  styleUrls: ['./wv-extended-list-selector.component.scss']
})
export class WvExtendedListSelectorComponent extends ListSelectorComponent {


  public i: number = 0;
  public datasetSelected: boolean = false;
  public selectedProviderUrl: string = '';

  constructor(protected listSelectorService: ListSelectorService, protected apiInterface: HelgolandServicesConnector,
    protected router: Router, private selProv: SelectedProviderService) {
    super(listSelectorService, apiInterface);
    // this.listSelectorService.cache.clear();

  }

  /**
   * move to diagram component view
   * @param url 
   */
  moveToDiagram(url: string) {
    this.router.navigateByUrl(url);
  }

/**
 * set Filter based on selected parameter
 * @param item selected parameter
 * @param index index if parameter is selected
 */
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

    super.itemSelected(item, index);

    if (index === this.parameters.length - 1) {
      this.datasetSelected = true;
    }
    else {
      this.datasetSelected = false;
    }
    this.i = index;
  }

  /**
   * on changes set url and set new filterList
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.selProv.getSelectedProvider().subscribe((res) => {
      this.selectedProviderUrl = res.url;
    });
    this.parameters[0].filterList = this.providerList.map((entry) => {
      entry.filter = this.filter;
      entry.url = this.selectedProviderUrl;
      return entry;
    });
  }
}
