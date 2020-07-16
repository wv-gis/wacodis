import { Component, OnInit, OnDestroy } from '@angular/core';
import { ParameterFacetType, FacetSearchService } from '@helgoland/facet-search';
import { InitializeService } from 'src/app/services/initialize.service';
import { Subscription } from 'rxjs';

/**
 * Facet Component for Dataset Selection to show in diagram
 */
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

  /**
   * remove subscription on Destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * set the facet Parameters based on selected provider Url
   */
  ngOnInit(): void {
    this.subscriptions.push(this.facetSearch.getResults().subscribe(res => this.facetsActive = this.facetSearch.areFacetsSelected()));
    this.subscriptions.push(this.initializeService.getLoading().subscribe(loading => this.loading = loading));
  }

  /**
   * reset the facetSearch to default
   */
  public resetAll() {
    this.facetSearch.resetAllFacets();
  }
}
