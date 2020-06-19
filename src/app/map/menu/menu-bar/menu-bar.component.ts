import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { settings } from 'src/environments/environment';
import { DatasetApi, PlatformTypes, ValueTypes, SettingsService, Settings, HelgolandParameterFilter, HelgolandServicesConnector, HelgolandService } from '@helgoland/core';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';


@Component({
  selector: 'wv-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  public label = 'Wupperverband Zeitreihen Dienst';
  public labelList: String[] = [];
  public datasetApis: DatasetApi[] = [];
  public selectedService: HelgolandService;
  public providerFilter: HelgolandParameterFilter = {
    platformType: PlatformTypes.stationary,
    // valueTypes: ValueTypes.quantity
  };


  @Output()
  public onProviderSwitched: EventEmitter<String> = new EventEmitter<String>();

  constructor(private settingsService: SettingsService<Settings>, private datasetApiInt: HelgolandServicesConnector, private selProv: SelectedProviderService) {

    if (settingsService.getSettings().datasetApis) {
      this.datasetApis = settingsService.getSettings().datasetApis;

      this.selProv.getSelectedProvider().subscribe((res) => {
        if (res.url) {
          this.datasetApiInt.getServices(res.url).subscribe((service) => {
            service.forEach(s=> {if( s.id == res.id){ this.selectedService = s}});
            // this.selProv.setProvider({ id: this.selectedService.id, url: this.selectedService.apiUrl });
            this.label = this.selectedService.label;
          });
        }
        else {
          this.datasetApiInt.getServices(this.settingsService.getSettings().defaultService.apiUrl).subscribe((service) => {
            this.selectedService = service[0];
            this.selProv.setProvider({ id: this.selectedService.id, url: this.selectedService.apiUrl });
            this.label = this.selectedService.label;
          });
        }
      });
    }

  }

  ngOnInit() {
  }

  switchProvider(provider: HelgolandService) {
    this.selectedService = provider;
    this.label = provider.label;
    this.onProviderSwitched.emit(provider.apiUrl);
    this.selProv.setProvider({ id: provider.id, url: provider.apiUrl });
    

  }
}
