import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { IDataset, Provider, Service, DatasetService, DatasetOptions } from '@helgoland/core';
import { ListSelectorParameter } from '@helgoland/selector';
import { DatasetEmitService } from '../../services/dataset-emit.service';
import { SelectedUrlService } from '../../services/selected-url.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wv-station-list-selector',
  templateUrl: './station-list-selector.component.html',
  styleUrls: ['./station-list-selector.component.scss']
})
export class StationListSelectorComponent implements OnChanges, OnDestroy {


 
  // @Input()
  // selectedProvider: Service;

  public stationParams: ListSelectorParameter[] = [
    {
      type: 'feature',
      header: 'Station'
    },
    {
      type: 'category',
      header: 'Kategorie'
    }, {
      type: 'phenomenon',
      header: 'Phänomen'
    }, {
      type: 'procedure',
      header: 'Sensor'
    }];

  public selectedProviderList: Provider[] = [];
  public subscription: Subscription;


  constructor(private datasetService: DatasetService<DatasetOptions>, private selectedService: SelectedUrlService) {

    this.subscription = selectedService.service$.subscribe((res) => {
      if (this.selectedProviderList) {
        this.selectedProviderList = [];
      }
      this.selectedProviderList.push({
        id: res.id,
        url: res.apiUrl
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    console.log('Change StationListSelector');
  }

  public onDatasetSelected(datasets: IDataset[]) {
    datasets.forEach((dataset) => {
      this.datasetService.addDataset(dataset.internalId);
      console.log('StationSelect: ' + dataset.internalId);
    })

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
