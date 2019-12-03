import { FacetSearchService } from "@helgoland/facet-search";
import { DatasetApiInterface } from "@helgoland/core";
import { forkJoin } from "rxjs";
import { Injectable } from "@angular/core";
import { SelectedProviderService } from "./selected-provider.service";

@Injectable({
    providedIn: 'root'
})
export class InitializeService {
    constructor(
        private facetSearch: FacetSearchService,
        private api: DatasetApiInterface
      ) { }
    init() {
      
        forkJoin([
        
            this.api.getTimeseries('https://fluggs.wupperverband.de/sos2/api/v1/', { expanded: true }),

        ]).subscribe(res => {
            const complete = [];
            res.forEach(e => complete.push(...e));
            this.facetSearch.setTimeseries(complete);
        });

    }
}