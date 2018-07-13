import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Service, DatasetApi, ParameterFilter, PlatformTypes, ValueTypes, SettingsService, Settings, DatasetApiInterface } from '@helgoland/core';
import { Router, NavigationExtras } from '@angular/router';
import { ExtendedSettingsService } from '../../settings/settings.service';



@Component({
  selector: 'wv-selection-menu',
  templateUrl: './selection-menu.component.html',
  styleUrls: ['./selection-menu.component.css']
})

export class SelectionMenuComponent implements OnInit, OnChanges{

 
  
  public label = 'Wupperverband Zeitreihen Dienst';
  public active: boolean;
  public selectedService: Service ;//= null;
  public endpoint: string;

  @Output()
  public onProviderSelected: EventEmitter<Service> = new EventEmitter<Service>();


  // public datasetApis: DatasetApi[];
  constructor(private router: Router, private settings: ExtendedSettingsService, private datasetApiInt: DatasetApiInterface) { 
   
  }
  public datasetApis: DatasetApi[] = [
  //   { 
  //     name: 'Fluggs Rest Api',
  //     url: 'http://www.fluggs.de/sos2/api/v1/'
  //   },
 
  // {
  //   name: 'Sensorweb Testbed Api',
  //   url: 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/'
  // }
    
];

  ngOnInit(): void {
    // this.onProviderSelected.emit(this.selectedService);
    if(this.settings.getSettings().datasetApis){
      if(this.selectedService){
        this.datasetApiInt.getService(this.selectedService.id,this.selectedService.apiUrl).subscribe((service) => {
          this.selectedService = service;
          this.onProviderSelected.emit(this.selectedService);
        });
      }else{
        for(let i = 0; i < this.settings.getSettings().datasetApis.length; i++){
          this.datasetApis.push( this.settings.getSettings().datasetApis[i]);
         console.log('Test')
        }
       
      }
      this.datasetApiInt.getService('1',this.settings.getSettings().datasetApis[0].url).subscribe((service) => {
        this.selectedService = service;
        this.onProviderSelected.emit(this.selectedService);
      });
    }
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.endpoint){
      this.endpoint = '';
    }
  }
 
  public providerFilter: ParameterFilter = {
    platformTypes: PlatformTypes.stationary,
    valueTypes: ValueTypes.quantity
  };

  public switchProvider(service: Service) {
    this.onProviderSelected.emit(service);
    this.selectedService = service;
    this.label = service.label;
   

  }

  navigateTo(url: string) {
    // let navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     selectedService: this.selectedService,
    //     selectorId: url.split('-')[1]
    //   }
    // }
    this.router.navigateByUrl(url);
    
    // this.router.navigate([url], navigationExtras);
  }
  // checkSelection(route: string) {
  //   if (this.router.isActive(route, true)) {
  //     return true;

  //   }
  //   else {
  //     return false;
  //   }
  // }

}