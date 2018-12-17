import { Injectable, EventEmitter } from '@angular/core';
import { Service } from '@helgoland/core';
import { MenuModule } from '../selection-menu/menu.module';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class SelectedUrlService {

  private selectedService: Service = {id: '', apiUrl: '', label: '', extras: [''], href: '', type: '', version: ''};
   private observableService = new BehaviorSubject<Service>(this.selectedService);
   service$ = this.observableService.asObservable();

  constructor() { }

  setService(service: Service){

    this.observableService.next(service);
  }


}
