import { FacetSearchService } from "@helgoland/facet-search";
import { DatasetApiInterface, Service } from "@helgoland/core";
import { Injectable, EventEmitter } from "@angular/core";
import { SelectedProviderService } from "./selected-provider.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class InitializeService {

    private loading: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private facetSearch: FacetSearchService,
        private api: DatasetApiInterface,
        private providerService: SelectedProviderService,
      ) { 

    this.providerService.getSelectedProvider().subscribe((service)=>{
            if (service) {
                this.api.getService(service.id, service.url).subscribe(s => this.init(s));
              } else {
                console.error(`No 'defaultService' is defined in the settings.`);
              }

        });
     
      }
    init(service: Service) {    
   
        this.loading.next(true);
            this.api.getTimeseries(service.apiUrl, { expanded: true, service: service.id }).subscribe(
                res => this.facetSearch.setTimeseries(res),
                error => console.error(error),
                () => this.loading.next(false)
        );
       
    }
    public getLoading(): Observable<boolean> {
        return this.loading;
      }
}