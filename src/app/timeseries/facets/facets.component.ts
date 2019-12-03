import { Component, OnInit } from '@angular/core';
import { ParameterFacetType, FacetSearchService } from '@helgoland/facet-search';

@Component({
  selector: 'wv-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.css']
})
export class FacetsComponent {

  public categoryType: ParameterFacetType = ParameterFacetType.category;
  public featureType: ParameterFacetType = ParameterFacetType.feature;
  public phenomenonType: ParameterFacetType = ParameterFacetType.phenomenon;

  public categoryAutocomplete: string;
  public featureAutocomplete: string;
  public phenomenonAutocomplete: string;

  constructor(
    public facetSearch: FacetSearchService
  ) { }


}
