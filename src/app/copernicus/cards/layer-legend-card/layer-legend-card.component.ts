import { Component, OnInit } from '@angular/core';
import { ExtendedOlLayerLegendUrlComponent } from 'src/app/map/legend/extended/extended-ol-layer-legend-url/extended-ol-layer-legend-url.component';
import { WmsCapabilitiesService } from '@helgoland/open-layers';

@Component({
  selector: 'wv-layer-legend-card',
  templateUrl: './layer-legend-card.component.html',
  styleUrls: ['./layer-legend-card.component.css']
})

/**
 * component extends LayerLegendURL Component to draw Legend for Layers within card-body
 */
export class LayerLegendCardComponent extends ExtendedOlLayerLegendUrlComponent implements OnInit {

  
  constructor(private wmsCaps: WmsCapabilitiesService) {super(wmsCaps); }

  ngOnInit() {
    this.deliverLegendUrl();
  }

}
