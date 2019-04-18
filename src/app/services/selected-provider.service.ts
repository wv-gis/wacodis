import { Injectable } from '@angular/core';
import { Service, Provider } from '@helgoland/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedProviderService {

  private selectedProvider: Provider = {id: '', url: ''};
  private observableService = new BehaviorSubject<Provider>(this.selectedProvider);
  service$ = this.observableService.asObservable();

 constructor() { }

 setProvider(provider: Provider){

   this.observableService.next(provider);
 }
}
