import { Component, OnInit, Input } from '@angular/core';
import { MapCache } from '@helgoland/map';
import BaseLayer from 'ol/layer/Base';
import { OlMapService } from '@helgoland/open-layers';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'wv-layer-tree',
  templateUrl: './layer-tree.component.html',
  styleUrls: ['./layer-tree.component.css']
})
export class LayerTreeComponent implements OnInit {
  @Input() baselayers: BaseLayer[];
  @Input() mapId: string;
  
  public isActive = true;
  public display = 'none';

  constructor(private mapService: OlMapService) { }

  ngOnInit() {
  }
  public change() {

    if (document.getElementById('map') !== undefined) {
      if (this.isActive) {
        document.getElementById('map').setAttribute('style', ' width: 100%;height: 100%; padding: 5px; position:fixed;');
      }
      else {
        document.getElementById('map').setAttribute('style', 'width: 82% ;height: 100%; padding: 5px; position:fixed;');
      }
    }
    this.mapService.getMap(this.mapId).subscribe(map => map.updateSize());
    this.mapService.getMap(this.mapId).subscribe(map => map.getView());
    // return this.isActive = !this.isActive;
  
    this.isActive = !this.isActive;
  }

  public getLegendUrl(url: string) {

    console.log(url);
      var img = document.getElementById('legend'); 
      img.setAttribute('src', url);
      document.getElementById('legendToast').setAttribute('style', 'visibility:visible');
      
      // this.display = 'inline';
    
    }
    public toggleVisibility(layer: BaseLayer ) {
      
        layer.setVisible(!layer.getVisible());
      }

      public removeLayer(i: number) {
        const layer = this.baselayers.splice(i,1);
        this.mapService.getMap(this.mapId).subscribe(map => map.removeLayer(layer[0]));
      }

      public onCloseHandled() {
        
            document.getElementById('legendToast').setAttribute('style', 'visibility: hidden;');
          }
}
