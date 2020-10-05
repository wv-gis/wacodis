import { Component, OnInit, SimpleChanges } from '@angular/core';
import { MultiServiceFilterSelectorComponent, FilteredParameter, MultiServiceFilterEndpoint, ListSelectorService } from '@helgoland/selector';
import {  HelgolandServicesConnector, DatasetType } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';

/**
 * Extended MultiServiceFilterSelectorComponent to add styling informations and missing uoms
 */
@Component({
  selector: 'wv-extended-multiservice-filter-selector',
  templateUrl: './wv-extended-multiservice-filter-selector.component.html',
  styleUrls: ['./wv-extended-multiservice-filter-selector.component.css']
})
export class WvExtendedMultiserviceFilterSelectorComponent extends MultiServiceFilterSelectorComponent implements OnInit {

  public selectedItems = [];
  public endpoint: MultiServiceFilterEndpoint = this.endpoint;
  public i = 0;
  public uoms = [];
  public selectedProviderUrl: string = '';


  constructor(protected datasetApiInterface: HelgolandServicesConnector, protected translate: TranslateService,
    private selProv: SelectedProviderService, private listSelService: ListSelectorService) {
    super(datasetApiInterface, translate);
    this.uoms = [];
    this.selProv.getSelectedProvider().subscribe((res) => {
      this.selectedProviderUrl = res.url;
    });
  }

  ngOnInit() {
 
  }

  /**
   * set the items selected to style it based on selection
   * @param item selected item
   */
  onSelectItem(item: FilteredParameter) {
    super.onSelectItem(item);
    this.selectedItems = [];
    this.selectedItems.push(item.label);
  }

  /**
   * when a new parameter is selected in list add selection to filter lIst
   * add uom to shown parameters
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    this.uoms = [];
    if (this.filterList[0] != undefined) {
      this.filterList[0].url = this.selectedProviderUrl;
      

      this.datasetApiInterface.getDatasets(this.filterList[0].url, 
        {category: this.filterList[0].filter.category, 
          phenomenon: this.filterList[0].filter.phenomenon,
          procedure: this.filterList[0].filter.procedure,
          feature: this.filterList[0].filter.feature,
          offering: this.filterList[0].filter.offering,
          service: this.filterList[0].filter.service,
          expanded: this.filterList[0].filter.expanded,
          lang: this.filterList[0].filter.lang,
          type:DatasetType.Timeseries}).subscribe((res) => {
        res.forEach((ts) => {
          if (ts.uom != 'mNHN') {
            this.uoms.push(ts.uom);
            this.uoms = this.uoms.filter((value, i, self) => self.indexOf(value) === i);
          }
        })
      });
    }
  }

}
