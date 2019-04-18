import { Component, OnInit, Input } from '@angular/core';
import { MultiServiceFilterSelectorComponent, FilteredParameter, MultiServiceFilterEndpoint, ListSelectorService } from '@helgoland/selector';
import { DatasetApiInterface } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { SimpleChanges } from '@angular/core';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';


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


  constructor(protected datasetApiInterface: DatasetApiInterface, protected translate: TranslateService,
    private selProv: SelectedProviderService) {
    super(datasetApiInterface, translate);
    this.uoms = [];
    this.selProv.service$.subscribe((res) => {
      this.selectedProviderUrl = res.url;
    });
  }

  ngOnInit() {
  }

  onSelectItem(item: FilteredParameter) {
    super.onSelectItem(item);
    this.selectedItems = [];
    this.selectedItems.push(item.label);
  }
  ngOnChanges() {
    super.ngOnChanges();

    this.uoms = [];
    if (this.filterList[0] != undefined) {
      this.filterList[0].url = this.selectedProviderUrl;

      this.apiInterface.getTimeseries(this.filterList[0].url, this.filterList[0].filter).subscribe((res) => {
        res.forEach((ts) => {
          // console.log(ts.uom + ' Filter: ' + JSON.stringify(this.filterList[0].filter));
          if (ts.uom != 'mNHN') {
            this.uoms.push(ts.uom);
            this.uoms = this.uoms.filter((value, i, self) => self.indexOf(value) === i);
          }
        })
      });
    }
  }

}
