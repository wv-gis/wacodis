import { Component, OnInit, Input } from '@angular/core';
import { OlLayerAnimateTimeComponent, WmsCapabilitiesService } from '@helgoland/open-layers';

@Component({
  selector: 'wv-extended-ol-layer-animate-time',
  templateUrl: './extended-ol-layer-animate-time.component.html',
  styleUrls: ['./extended-ol-layer-animate-time.component.css']
})
export class ExtendedOlLayerAnimateTimeComponent extends OlLayerAnimateTimeComponent implements OnInit {

  @Input() timeInterval = 2000;

  constructor(protected wmsCaps: WmsCapabilitiesService) {
    super(wmsCaps);
  }

  ngOnInit() {
  }

}
