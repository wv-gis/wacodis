import { Component,  Output, EventEmitter,SimpleChanges } from '@angular/core';
import {  FilteredParameter, ServiceFilterSelectorComponent } from '@helgoland/selector';
import { TranslateService } from '@ngx-translate/core';
import {  HelgolandServicesConnector } from '@helgoland/core';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';

@Component({
  selector: 'wv-extended-phenomenon-service-filter-selector',
  templateUrl: './extended-phenomenon-service-filter-selector.component.html',
  styleUrls: ['./extended-phenomenon-service-filter-selector.component.css']
})
/**
 * Selection Component to filter the shown stations on map based on selection
 */
export class ExtendedPhenomenonServiceFilterSelectorComponent extends ServiceFilterSelectorComponent {


  @Output()
  stationFilter = new EventEmitter();

  public selectionID: string = null;
  constructor(protected datasetApiInterface: HelgolandServicesConnector, protected translate: TranslateService, private selProv: SelectedProviderService) {
    super(translate, datasetApiInterface);
  }
/**
 * filter parameter list based on selected param
 * @param item filtered Parameter selected
 */
  onSelectItem(item: FilteredParameter) {
    super.onSelectItem(item);
    this.selectionID = item.id;

  }
  /**
   * remove filtered Parameter of phenomena list
   */
  removeFilter() {
    this.onItemSelected.emit();
    this.selectionID = null;
    this.stationFilter.emit();
  }

  /**
   * set provider and phenomena list based on selected service
   * @param changes changes to handle
   */
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.selProv.getSelectedProvider().subscribe((res)=>{
      this.serviceUrl = res.url;
    });
    this.datasetApiInterface.getPhenomena(this.serviceUrl, this.filter)
      .subscribe((res) => {
        if (res instanceof Array) {
          this.items = res;
        } else {
          this.items = [];
        }
      });
  }
}
