import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { legendParam } from '../../legend/extended/extended-ol-layer-legend-url/extended-ol-layer-legend-url.component';

@Component({
  selector: 'wv-layer-legend-table',
  templateUrl: './layer-legend-table.component.html',
  styleUrls: ['./layer-legend-table.component.css']
})
export class LayerLegendTableComponent implements OnInit {

  @Input()
  urls: legendParam[];
  @Input()
  url: string;

  constructor() { }

  ngOnInit() {
  }

  onCloseHandled(){
    document.getElementById("legendToast").hidden =  true;
  }
}
