import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { legendParam } from '../../legend/extended/extended-ol-layer-legend-url/extended-ol-layer-legend-url.component';

@Component({
  selector: 'wv-layer-legend-table',
  templateUrl: './layer-legend-table.component.html',
  styleUrls: ['./layer-legend-table.component.css']
})
/**
 * component to depict the legend of the selected layer as a Toast
 * based on the input parameters
 */
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
