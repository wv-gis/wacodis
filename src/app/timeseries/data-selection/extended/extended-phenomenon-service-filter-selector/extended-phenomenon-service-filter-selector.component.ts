import { Component, OnInit, Output, EventEmitter,SimpleChanges } from '@angular/core';
import { MultiServiceFilterSelectorComponent, FilteredParameter, ServiceFilterSelectorComponent } from '@helgoland/selector';
import { TranslateService } from '@ngx-translate/core';
import { DatasetApiInterface } from '@helgoland/core';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';

@Component({
  selector: 'wv-extended-phenomenon-service-filter-selector',
  templateUrl: './extended-phenomenon-service-filter-selector.component.html',
  styleUrls: ['./extended-phenomenon-service-filter-selector.component.css']
})
export class ExtendedPhenomenonServiceFilterSelectorComponent extends ServiceFilterSelectorComponent {


  @Output()
  stationFilter = new EventEmitter();

  public selectionID: string = null;
  constructor(protected datasetApiInterface: DatasetApiInterface, protected translate: TranslateService, private selProv: SelectedProviderService) {
    super(translate, datasetApiInterface);
  }

  onSelectItem(item: FilteredParameter) {
    super.onSelectItem(item);
    this.selectionID = item.id;

  }
  removeFilter() {
    this.onItemSelected.emit();
    this.selectionID = null;
    this.stationFilter.emit();
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.selProv.service$.subscribe((res)=>{
      this.serviceUrl = res.url;
    });
    this.apiInterface.getPhenomena(this.serviceUrl, this.filter)
      .subscribe((res) => {
        if (res instanceof Array) {
          this.items = res;
        } else {
          this.items = [];
        }
      });
  }
}
