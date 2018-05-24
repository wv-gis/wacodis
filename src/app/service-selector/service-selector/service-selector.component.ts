import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatasetApi, Service } from '@helgoland/core';


@Component({
  selector: 'wv-service-selector',
  templateUrl: './service-selector.component.html',
  styleUrls: ['./service-selector.component.css']
})


export class ServiceSelectorComponent {

  @Output()
  public onProviderSelected: EventEmitter<String> = new EventEmitter<String>();

  public datasetApis: DatasetApi[] = [
    {
      name: 'Fluggs Rest Api',
      url: 'http://www.fluggs.de/sos2/api/v1/'
    },
    {
      name: 'Sensorweb Testbed Api',
      url: 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/'
    }
  ];


  public switchProvider(service: Service) {
    this.onProviderSelected.emit(service.apiUrl);
  }

}
