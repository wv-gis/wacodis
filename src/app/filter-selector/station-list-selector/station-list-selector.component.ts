import { Component, OnInit} from '@angular/core';
import { IDataset, Provider, Service, LocalStorage} from '@helgoland/core';
import { ListSelectorParameter } from '@helgoland/selector';
import { DatasetEmitService } from '../../services/dataset-emit.service';

@Component({
  selector: 'wv-station-list-selector',
  templateUrl: './station-list-selector.component.html',
  styleUrls: ['./station-list-selector.component.scss']
})
export class StationListSelectorComponent  {

  public categoryParams: ListSelectorParameter[] = [
    {
      type: 'feature',
      header: 'Station'
    }, 
    {
    type: 'category',
    header: 'Kategorie'
  },    {
    type: 'phenomenon',
    header: 'Phänomen'
  }, {
    type: 'procedure',
    header: 'Sensor'
  }];

  public selectedProviderList: Provider[] = [];

  constructor(private datasetService: DatasetEmitService) {
    this.selectedProviderList.push({
      id: '1',
      url: 'http://www.fluggs.de/sos2/api/v1/',
    });
  }

  public onDatasetSelected(datasets: IDataset[]) {
    datasets.forEach((dataset) => {
      this.datasetService.addDataset(dataset.internalId);
      console.log('StationSelect: ' + dataset.internalId);
    })

  }

  public getProviderUrl(service: Service){
    this.selectedProviderList = [];
    this.selectedProviderList.push({
      id: service.id,
      url: service.apiUrl
    });
  }

}
