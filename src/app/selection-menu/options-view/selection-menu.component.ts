import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Service, DatasetApi, ParameterFilter, PlatformTypes, ValueTypes, SettingsService, Settings, DatasetApiInterface } from '@helgoland/core';
import { Router, NavigationExtras } from '@angular/router';
import { ExtendedSettingsService } from '../../settings/settings.service';
import { SelectedUrlService } from '../../services/selected-url.service';



@Component({
  selector: 'wv-selection-menu',
  templateUrl: './selection-menu.component.html',
  styleUrls: ['./selection-menu.component.css'], providers: [SelectedUrlService]
})

export class SelectionMenuComponent implements OnInit, OnChanges {

  public label = 'Wupperverband Zeitreihen Dienst';
  public active: boolean;
  public isFirst: boolean = true;
  public selectedService: Service;
  public endpoint: string;
  public clicked: boolean = false;

  constructor(private router: Router, private settings: ExtendedSettingsService, private datasetApiInt: DatasetApiInterface, private selService: SelectedUrlService) {
    if (this.settings.getSettings().datasetApis) {
      for (let i = 0; i < this.settings.getSettings().datasetApis.length; i++) {
        this.datasetApis.push(this.settings.getSettings().datasetApis[i]);

      }
      if (this.isFirst) {
        this.isFirst = false;
        this.datasetApiInt.getServices( this.settings.getSettings().datasetApis[0].url).subscribe((service) => {
          this.selService.setService(service[0]);
          this.selectedService = service[0];
        });
      }
      else{
        this.selService.service$.subscribe((res) => {
          this.selectedService = res;
          this.selService.setService(res);
         this.datasetApiInt.getService(res.id, res.apiUrl).subscribe();
        });
      }
     
    }
  }
  public datasetApis: DatasetApi[] = [  ];

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  public providerFilter: ParameterFilter = {
    platformTypes: PlatformTypes.stationary,
    valueTypes: ValueTypes.quantity
  };

  public switchProvider(service: Service) {

    this.selectedService = service;
    this.selService.setService(service);
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

  // setActive(){
  //   if(document.getElementById('splitter').getAttribute('class').includes('active')){
  //     console.log(document.getElementById('splitter').getAttribute('class'));
     
  //     return true;
  //   }
  //   else{
     
  //     return false;
  //   }
  // }

}