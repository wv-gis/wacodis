import { Component, OnInit } from '@angular/core';
import { ListSelectorComponent, ListSelectorService } from '@helgoland/selector';
import { DatasetApiInterface, DatasetApiMapping } from '@helgoland/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wv-extended-list-selector',
  templateUrl: './extended-list-selector.component.html',
  styleUrls: ['./extended-list-selector.component.scss']
})
export class ExtendedListSelectorComponent extends ListSelectorComponent {




   constructor( protected listSelectorService: ListSelectorService,
    protected apiInterface: DatasetApiInterface,
    protected apiMapping: DatasetApiMapping, protected router: Router){
      super(listSelectorService, apiInterface, apiMapping);
      listSelectorService.cache
    }
  moveToDiagram(url: string) {
    this.router.navigateByUrl(url);
  }

}
