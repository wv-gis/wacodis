import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ListSelectorParameter } from '@helgoland/selector';
import { Provider, IDataset, Service, DatasetService, DatasetOptions } from '@helgoland/core';
import { DatasetEmitService } from '../../services/dataset-emit.service';
import { SelectedUrlService } from '../../services/selected-url.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wv-phenomenon-list-selector',
  templateUrl: './phenomenon-list-selector.component.html',
  styleUrls: ['./phenomenon-list-selector.component.scss']
})
export class PhenomenonListSelectorComponent implements OnChanges, OnDestroy{

 
  @Input()
  selectedProvider: Service;

  public phenomenonParams: ListSelectorParameter[] = [
    {
      type: 'phenomenon',
      header: 'Phänomen'
    },
    {
      type: 'category',
      header: 'Kategorie'
    }, {
      type: 'feature',
      header: 'Station'
    }, {
      type: 'procedure',
      header: 'Sensor'
    }];

  public selectedProviderList: Provider[] = [];
    public subscription: Subscription;
  constructor(private datasetService: DatasetService<DatasetOptions>, private selectedService: SelectedUrlService) { 

    this.subscription = selectedService.service$.subscribe((res) => {
      if(this.selectedProviderList){
        this.selectedProviderList = [];
      }
      this.selectedProviderList.push({
        id: res.id,
        url: res.apiUrl
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.selectedProvider){
      this.selectedProviderList = [];
      this.selectedProviderList.push({
        id: this.selectedProvider.id,
        url: this.selectedProvider.apiUrl,
      });
    }

  }

  public onDatasetSelected(datasets: IDataset[]) {
    datasets.forEach((dataset) => {
      this.datasetService.addDataset(dataset.internalId);
    })
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
