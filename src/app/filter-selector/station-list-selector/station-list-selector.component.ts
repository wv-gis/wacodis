import { Component, OnInit} from '@angular/core';
import { IDataset, Provider } from '@helgoland/core';
import { ListSelectorParameter } from '@helgoland/selector';

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

  constructor() {
    this.selectedProviderList.push({
      id: '1',
      url: 'http://www.fluggs.de/sos2/api/v1/'//'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/'
    });
  }

  public onDatasetSelected(datasets: IDataset[]) {
    datasets.forEach((dataset) => console.log('Select Dataset: ' + dataset.label + ' with ID: ' + dataset.id));

  }

}
