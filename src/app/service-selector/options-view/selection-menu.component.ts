import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Service, DatasetApi, ParameterFilter, PlatformTypes, ValueTypes } from '@helgoland/core';
import { Router } from '@angular/router';



@Component({
  selector: 'wv-selection-menu',
  templateUrl: './selection-menu.component.html',
  styleUrls: ['./selection-menu.component.css']
})

export class SelectionMenuComponent {

  public label = 'Wupperverband Zeitreihen Dienst';
  public active: boolean;

  @Output()
  public onProviderSelected: EventEmitter<Service> = new EventEmitter<Service>();


  constructor(private router: Router) { }

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
    this.onProviderSelected.emit(service);
    this.label = service.label;
    // console.log(service.apiUrl);
  }
  public providerFilter: ParameterFilter = {
    platformTypes: PlatformTypes.stationary,
    valueTypes: ValueTypes.quantity
  };

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }
  checkSelection(route: string) {
    if (this.router.isActive(route, true)) {
      return true;

    }
    else {
      return false;
    }
  }

}