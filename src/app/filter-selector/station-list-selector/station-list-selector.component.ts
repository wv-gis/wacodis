import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import { IDataset, Provider, Service} from '@helgoland/core';
import { ListSelectorParameter } from '@helgoland/selector';
import { DatasetEmitService } from '../../services/dataset-emit.service';

@Component({
  selector: 'wv-station-list-selector',
  templateUrl: './station-list-selector.component.html',
  styleUrls: ['./station-list-selector.component.scss']
})
export class StationListSelectorComponent implements OnChanges {

  
  @Input()
  selectedProvider: Service;

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

  constructor(private datasetService: DatasetEmitService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.selectedProvider){
      this.selectedProviderList = [];
      this.selectedProviderList.push({
        id: this.selectedProvider.id,
        url: this.selectedProvider.apiUrl,
      });
     }
    //  console.log(changes.selectedProvider.currentValue);
  }

  public onDatasetSelected(datasets: IDataset[]) {
    datasets.forEach((dataset) => {
      this.datasetService.addDataset(dataset.internalId);
      console.log('StationSelect: ' + dataset.internalId);
    })

  }

  // public getProviderUrl(service: Service){
  //   this.selectedProviderList = [];
  //   this.selectedProviderList.push({
  //     id: service.id,
  //     url: service.apiUrl
  //   });
  // }

}
