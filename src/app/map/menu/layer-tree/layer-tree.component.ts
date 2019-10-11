import { Component, OnInit, Input } from '@angular/core';
import { MapCache } from '@helgoland/map';
import BaseLayer from 'ol/layer/Base';
import { OlMapService } from '@helgoland/open-layers';

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

  //   if (document.getElementById('mainMap') !== undefined) {
  //     if (this.isActive) {
  //       document.getElementById('mainMap').setAttribute('style', ' right: 0px;');
  //     }
  //     else {
  //       document.getElementById('mainMap').setAttribute('style', 'right: 400px;');
  //     }
  //   }
  //   this.mapCache.getMap('map').invalidateSize();
  //   this.mapCache.getMap('map').setView(this.mapCache.getMap('map').getCenter(), this.mapCache.getMap('map').getZoom());
  //   return this.isActive = !this.isActive;
  // }
    this.isActive = !this.isActive;
  }

  public getLegendUrl(url: string) {
    //  alert(url);
      console.log(url);
      var img = document.getElementById('legend'); 
      img.setAttribute('src', url);
      this.display = 'inline';
    
    }
    public toggleVisibility(layer: BaseLayer ) {
      
        layer.setVisible(!layer.getVisible());
      }

      public removeLayer(i: number) {
        const layer = this.baselayers.splice(i,1);
        this.mapService.getMap(this.mapId).subscribe(map => map.removeLayer(layer[0]));
      }
}
