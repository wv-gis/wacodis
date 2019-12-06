import { Component, OnInit, OnDestroy } from '@angular/core';
import { ParameterFacetType, FacetSearchService } from '@helgoland/facet-search';
import { InitializeService } from 'src/app/services/initialize.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wv-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.css']
})
export class FacetsComponent implements OnInit, OnDestroy{
 

  public categoryType: ParameterFacetType = ParameterFacetType.category;
  public featureType: ParameterFacetType = ParameterFacetType.feature;
  public phenomenonType: ParameterFacetType = ParameterFacetType.phenomenon;

  public categoryAutocomplete: string;
  public featureAutocomplete: string;
  public phenomenonAutocomplete: string;

  public facetsActive: boolean;
  public loading: boolean;

  public subscriptions: Subscription[] = [];

  constructor(
    public facetSearch: FacetSearchService,
    public initializeService: InitializeService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  ngOnInit(): void {
    // this.subscriptions.push(this.facetSearch.getResults().subscribe(res => this.facetsActive = this.facetSearch.areFacetsSelected()));
    this.subscriptions.push(this.initializeService.getLoading().subscribe(loading => this.loading = loading));
  }
  public resetAll() {
    // this.facetSearch.resetAllFacets();
  }
}
