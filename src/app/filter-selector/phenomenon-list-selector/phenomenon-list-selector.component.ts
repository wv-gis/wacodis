import { Component, OnInit } from '@angular/core';
import { ListSelectorParameter } from '@helgoland/selector';
import { Provider, IDataset, Service } from '@helgoland/core';
import { DatasetEmitService } from '../../services/dataset-emit.service';

@Component({
  selector: 'wv-phenomenon-list-selector',
  templateUrl: './phenomenon-list-selector.component.html',
  styleUrls: ['./phenomenon-list-selector.component.scss']
})
export class PhenomenonListSelectorComponent {

  public categoryParams: ListSelectorParameter[] = [
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

  constructor(private datasetService: DatasetEmitService) {
    this.selectedProviderList.push({
      id: '1',
      url: 'http://www.fluggs.de/sos2/api/v1/'
    });

  }

  public onDatasetSelected(datasets: IDataset[]) {
    datasets.forEach((dataset) => {
      this.datasetService.addDataset(dataset.internalId);
      console.log('StationSelect: ' + dataset.internalId);
    })
  }

  public getProviderUrl(service: Service) {
    this.selectedProviderList = [];
    this.selectedProviderList.push({
      id: service.id,
      url: service.apiUrl,
    })
    // this.selectedProviderList.forEach((entry)=>{
    //   if(entry.url==service.apiUrl){

    //   }
    // });

  }

}
