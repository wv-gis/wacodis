import { Component} from '@angular/core';
import { OlLayerLegendUrlComponent, WmsCapabilitiesService } from '@helgoland/open-layers';
import { ImageWMS } from 'ol/source';
import ImageArcGISRest from 'ol/source/ImageArcGISRest';

@Component({
  selector: 'wv-extended-ol-layer-legend-url',
  templateUrl: './extended-ol-layer-legend-url.component.html',
  styleUrls: ['./extended-ol-layer-legend-url.component.css']
})
export class ExtendedOlLayerLegendUrlComponent extends OlLayerLegendUrlComponent {


  constructor(private wmsCap: WmsCapabilitiesService) {
    super(wmsCap);
  }

  public deliverLegendUrl() {
    super.deliverLegendUrl();
    const source = this.layer.getSource();
    this.layer.getExtent();
    if (source instanceof ImageWMS) {
      const url = source.getUrl();
      const layerid = source.getParams()['layers'] || source.getParams()['LAYERS'];
      this.wmsCap.getLegendUrl(layerid, url).subscribe(res => this.legendUrl.emit(res));
    }
    else if (source instanceof ImageArcGISRest) {
      const url = source.getUrl();
      const layerid = source.getParams()['layers'] || source.getParams()['LAYERS'];
     
      this.legendUrl.emit(url + "/legend?bandIds=&renderingRule=landcover&f=json");
    }
  }

}
