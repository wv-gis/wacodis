import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { ExportImageButtonComponent } from '@helgoland/d3';

@Component({
  selector: 'wv-wv-extended-export-image-button',
  templateUrl: './wv-extended-export-image-button.component.html',
  styleUrls: ['./wv-extended-export-image-button.component.css']
})
export class WvExtendedExportImageButtonComponent extends ExportImageButtonComponent implements OnInit {
public pick = 'hidden';
  
  ngOnInit() {
  }
  
  public onCloseHandle(){
    this.pick = 'hidden';
  }

  public exportSettings(){
    this.pick ='visible';
   
  }

}
