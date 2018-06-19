import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Service, DatasetApi, ParameterFilter, PlatformTypes, ValueTypes, SettingsService, Settings } from '@helgoland/core';
import { Router } from '@angular/router';



@Component({
  selector: 'wv-selection-menu',
  templateUrl: './selection-menu.component.html',
  styleUrls: ['./selection-menu.component.css']
})

export class SelectionMenuComponent implements OnInit{

 
  public label = 'Wupperverband Zeitreihen Dienst';
  public active: boolean;
  public selectedService: Service;

  @Output()
  public onProviderSelected: EventEmitter<Service> = new EventEmitter<Service>();


  // public datasetApis: DatasetApi[];
  constructor(private router: Router) { 
   
  }

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

  ngOnInit(): void {
 
  //   this.datasetApis = this.settings.getSettings().datasetApis;
  //   this.datasetApis.forEach((entry)=>{
  //     console.log(entry.url);
  //   }
  // );
  }
 
  public providerFilter: ParameterFilter = {
    platformTypes: PlatformTypes.stationary,
    valueTypes: ValueTypes.quantity
  };

  public switchProvider(service: Service) {
    this.onProviderSelected.emit(service);
    // this.selectedService = service;
    this.label = service.label;

  }

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