import { FacetSearchService } from "@helgoland/facet-search";
import {   HelgolandService, HelgolandServicesConnector, DatasetType } from "@helgoland/core";
import { Injectable, EventEmitter } from "@angular/core";
import { SelectedProviderService } from "./selected-provider.service";
import { Observable } from "rxjs";

/**
 * Service for initializing the settings on start
 */
@Injectable({
    providedIn: 'root'
})
export class InitializeService {

    private loading: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private facetSearch: FacetSearchService,
        private api: HelgolandServicesConnector,
        private provider: SelectedProviderService,
      ) { 

    this.provider.getSelectedProvider().subscribe((service)=>{
            if (service) {
                this.api.getServices( service.url).subscribe(s => s.forEach(ser=>{if(service.id == ser.id){this.init(ser);}}));
              } else {
                console.error(`No 'defaultService' is defined in the settings.`);
              }

        });
     
      }
    init(service: HelgolandService) {    
   
        this.loading.next(true);
            this.api.getDatasets(service.apiUrl, { expanded: true, service: service.id, type: DatasetType.Timeseries }).subscribe(
                res =>{
                    this.facetSearch.resetAllFacets();
                    this.facetSearch.setTimeseries(res);
                } ,
                error => console.error(error),
                () => this.loading.next(false)
        );
       
    }
    public getLoading(): Observable<boolean> {
        return this.loading;
      }
}