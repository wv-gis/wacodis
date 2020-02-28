import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionMapComponent } from './map-view/selection-map/selection-map.component';
import { LayerTreeComponent } from './menu/layer-tree/layer-tree.component';
import { MenuBarComponent } from './menu/menu-bar/menu-bar.component';
import { WvExtendedServiceSelectorComponent } from './menu/extended-selector/wv-extended-service-selector/wv-extended-service-selector.component';
import { HelgolandMapModule, HelgolandMapControlModule, HelgolandMapSelectorModule, HelgolandMapViewModule } from '@helgoland/map';
import { HelgolandCoreModule } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';
import { ExtendedSettingsService } from 'src/app/settings/settings.service';
import { HttpClientModule } from '@angular/common/http';
import { ExtendedExtentControlComponent } from './menu/extended-selector/extended-extent-control/extended-extent-control.component';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';
import { RequestTokenService } from 'src/app/services/request-token.service';
import { HelgolandOpenLayersModule, OlMapService } from '@helgoland/open-layers';
import { ExtendedOlLayerTitleComponent } from './legend/extended/extended-ol-layer-title/extended-ol-layer-title.component';
import { ExtendedOlLayerTimeSelectorComponent } from './legend/extended/extended-ol-layer-time-selector/extended-ol-layer-time-selector.component';
import { ExtendedOlLayerZoomExtentComponent } from './legend/extended/extended-ol-layer-zoom-extent/extended-ol-layer-zoom-extent.component';
import { FormsModule } from '@angular/forms';
import { ExtendedOlLayerLegendUrlComponent } from './legend/extended/extended-ol-layer-legend-url/extended-ol-layer-legend-url.component';
import { ExtendedOlLayerAnimateTimeComponent } from './legend/extended/extended-ol-layer-animate-time/extended-ol-layer-animate-time.component';
import { LayerLegendTableComponent } from './menu/layer-legend-table/layer-legend-table.component';

@NgModule({
  imports: [
    CommonModule,
    HelgolandCoreModule,
    HelgolandMapModule,
    HelgolandMapControlModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
    HelgolandOpenLayersModule,
    TranslateModule,
    HttpClientModule,
    FormsModule,

  ],
  declarations: [SelectionMapComponent, LayerTreeComponent, MenuBarComponent, WvExtendedServiceSelectorComponent, ExtendedExtentControlComponent, ExtendedOlLayerTitleComponent, ExtendedOlLayerTimeSelectorComponent, ExtendedOlLayerZoomExtentComponent, ExtendedOlLayerLegendUrlComponent, ExtendedOlLayerAnimateTimeComponent, LayerLegendTableComponent],
  exports: [SelectionMapComponent, LayerTreeComponent, MenuBarComponent, WvExtendedServiceSelectorComponent],
  providers: [ExtendedSettingsService, SelectedProviderService, RequestTokenService, OlMapService],
})
export class WvMapModule { }
