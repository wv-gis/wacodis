import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeseriesViewComponent } from './depiction/timeseries-view/timeseries-view.component';
import { WvDataViewComponent } from './data-selection/wv-data-view/wv-data-view.component';
import { WvExtendedListSelectorComponent } from './data-selection/extended/wv-extended-list-selector/wv-extended-list-selector.component';
import { WvExtendedMultiserviceFilterSelectorComponent } from './data-selection/extended/wv-extended-multiservice-filter-selector/wv-extended-multiservice-filter-selector.component';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandLabelMapperModule, HelgolandDatasetlistModule, HelgolandDatasetDownloadModule } from '@helgoland/depiction';
import { TranslateModule } from '@ngx-translate/core';
import { DatasetEmitServiceService } from 'src/app/services/dataset-emit-service.service';
import { WvMapModule } from 'src/app/map/map.module';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandTimeModule } from '@helgoland/time';
import { WvExtendedTimeseriesEntryComponent } from './depiction/extended/wv-extended-timeseries-entry/wv-extended-timeseries-entry.component';
import { WvExtendedTimeshiftSelectorComponent } from './depiction/extended/wv-extended-timeshift-selector/wv-extended-timeshift-selector.component';
import { TimeseriesLegendComponent } from './depiction/menu-bar/timeseries-legend/timeseries-legend.component';
import { TimeshiftDataSelectorMenuComponent } from './depiction/menu-bar/timeshift-data-selector-menu/timeshift-data-selector-menu.component';
import { ExtendedSettingsService } from 'src/app/settings/settings.service';
import {  HelgolandMapSelectorModule } from '@helgoland/map';
import { ExtendedPhenomenonServiceFilterSelectorComponent } from './data-selection/extended/extended-phenomenon-service-filter-selector/extended-phenomenon-service-filter-selector.component';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';
import { HelgolandModificationModule } from '@helgoland/modification';
import { StyleModificationComponent } from './depiction/menu-bar/style-modification/style-modification.component';
import { WvExtendedExportImageButtonComponent } from './depiction/extended/wv-extended-export-image-button/wv-extended-export-image-button.component';
import { FacetsComponent } from './facets/facets.component';
import { WvParameterFacetComponent } from './facets/parameter-facet/parameter-facet.component';
import { WvResultListComponent } from './facets/result-list/result-list.component';
import { WvTimeSliderComponent } from './facets/time-slider/time-slider.component';
import { HelgolandFacetSearchModule, FacetSearchService } from '@helgoland/facet-search';


@NgModule({
  imports: [
    CommonModule,
    HelgolandSelectorModule,
    AppRoutingModule,
    HelgolandCoreModule,
    HelgolandLabelMapperModule, 
    TranslateModule,
    HelgolandD3Module,
    WvMapModule,
    HelgolandTimeModule,
    HelgolandDatasetlistModule,
    HelgolandMapSelectorModule,
    HelgolandModificationModule,
    HelgolandDatasetDownloadModule,
    HelgolandFacetSearchModule

  ],
  declarations: [TimeseriesViewComponent, WvDataViewComponent, WvExtendedListSelectorComponent,
     WvExtendedMultiserviceFilterSelectorComponent, WvExtendedTimeseriesEntryComponent, 
     WvExtendedTimeshiftSelectorComponent, TimeseriesLegendComponent, 
     TimeshiftDataSelectorMenuComponent, ExtendedPhenomenonServiceFilterSelectorComponent, 
     StyleModificationComponent, WvExtendedExportImageButtonComponent, FacetsComponent,
      WvParameterFacetComponent, WvResultListComponent, WvTimeSliderComponent
    ],
  providers:[DatasetEmitServiceService, ExtendedSettingsService, SelectedProviderService]

})
export class WvTimeseriesModule { }
