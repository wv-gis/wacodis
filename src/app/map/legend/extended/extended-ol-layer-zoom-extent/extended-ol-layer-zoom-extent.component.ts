import { Component, OnInit, Input } from '@angular/core';
import { OlLayerZoomExtentComponent, OlMapService, WmsCapabilitiesService } from '@helgoland/open-layers';
import { Required } from '@helgoland/core';
import BaseLayer from 'ol/layer/Base';

@Component({
  selector: 'wv-extended-ol-layer-zoom-extent',
  templateUrl: './extended-ol-layer-zoom-extent.component.html',
  styleUrls: ['./extended-ol-layer-zoom-extent.component.css']
})
export class ExtendedOlLayerZoomExtentComponent extends OlLayerZoomExtentComponent implements OnInit {
  @Required @Input() layer: BaseLayer;
  @Required @Input() mapId: string;


  constructor( private wmsCap: WmsCapabilitiesService,
    private mapService: OlMapService) {
      super(wmsCap, mapService);
     }

  ngOnInit() {
    super.ngOnInit();
  }

}
