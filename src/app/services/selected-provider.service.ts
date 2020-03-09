import { Injectable } from '@angular/core';
import { Service, Provider, SettingsService, Settings, DatasetApiInterface } from '@helgoland/core';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SelectedProviderService {

  // private selectedProvider: Provider = {id: '', url: ''};
  // private observableService = new BehaviorSubject<Provider>(this.selectedProvider);
  private selectedService: ReplaySubject<Provider> = new ReplaySubject();
  // service$ = this.observableService.asObservable();

 constructor(private settingService: SettingsService<Settings>, private api: DatasetApiInterface) { 
   const defaultSrvc = this.settingService.getSettings().datasetApis[1];
   if(defaultSrvc){
   this.setProvider({id: '1', url: defaultSrvc.url})

   }
 }

 setProvider(provider: Provider){
  this.selectedService.next(provider);
 }

 public getSelectedProvider(): Observable<Provider>{
   return this.selectedService;

 }
}
