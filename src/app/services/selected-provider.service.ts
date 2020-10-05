import { Injectable } from '@angular/core';
import {  Provider, SettingsService, Settings } from '@helgoland/core';
import {  ReplaySubject, Observable } from 'rxjs';

/**
 * Service to select the provider to request data from
 */

@Injectable({
  providedIn: 'root'
})
export class SelectedProviderService {

  // private selectedProvider: Provider = {id: '', url: ''};
  // private observableService = new BehaviorSubject<Provider>(this.selectedProvider);
  private selectedService: ReplaySubject<Provider> = new ReplaySubject();
  // service$ = this.observableService.asObservable();

  /**
   * check for defaultService in settings and set it as provider
   * @param settingService settings data service
   */
 constructor(private settingService: SettingsService<Settings> ) { 
   const defaultSrvc = this.settingService.getSettings().datasetApis[1];
   if(defaultSrvc){
   this.setProvider({id: '1', url: defaultSrvc.url})

   }
 }

 /**
  * on selection set new provider
  * @param provider selected provider
  */
 setProvider(provider: Provider){
  this.selectedService.next(provider);
 }

 /**
  * return selected provider service
  */
 public getSelectedProvider(): Observable<Provider>{
   return this.selectedService;

 }
}
