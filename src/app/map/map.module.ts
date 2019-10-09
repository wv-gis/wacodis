import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionMapComponent } from './map-view/selection-map/selection-map.component';
import { LayerTreeComponent } from './menu/layer-tree/layer-tree.component';
import { MenuBarComponent } from './menu/menu-bar/menu-bar.component';
import { WvExtendedServiceSelectorComponent } from './menu/extended-selector/wv-extended-service-selector/wv-extended-service-selector.component';
import { HelgolandMapModule, HelgolandMapControlModule, HelgolandMapSelectorModule, HelgolandMapViewModule } from '@helgoland/map';
import { HelgolandCoreModule, SettingsService, } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';
import { HelgolandLabelMapperModule, HelgolandDatasetlistModule } from '@helgoland/depiction';
import { ExtendedSettingsService } from 'src/app/settings/settings.service';
import { HttpClientModule } from '@angular/common/http';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { ExtendedExtentControlComponent } from './menu/extended-selector/extended-extent-control/extended-extent-control.component';
import { SelectedProviderService } from 'src/app/services/selected-provider.service';
import { RequestTokenService } from 'src/app/services/request-token.service';
import { HelgolandOpenLayersModule, OlMapService } from '@helgoland/open-layers';


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

  ],
  declarations: [SelectionMapComponent, LayerTreeComponent, MenuBarComponent, WvExtendedServiceSelectorComponent, ExtendedExtentControlComponent],
  exports: [SelectionMapComponent, LayerTreeComponent, MenuBarComponent, WvExtendedServiceSelectorComponent],
  providers: [ExtendedSettingsService, SelectedProviderService, RequestTokenService, OlMapService],
})
export class WvMapModule { }
