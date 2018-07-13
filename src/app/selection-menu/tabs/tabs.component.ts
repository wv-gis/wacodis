import { Component, OnInit, Input, ContentChildren, QueryList, AfterContentInit } from '@angular/core';


@Component({
  selector: 'wv-tab',
  template: `<div *ngIf='active' class='tab-content'>
                 <ng-content></ng-content>
             </div>`
})
export class TabComponent {
  active: boolean;
  @Input() title;
  @Input() picture;
  constructor() {
    this.active = false;
  }
}


@Component({
  selector: 'wv-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  ngAfterContentInit() {
    this.tabs.first.active = true;
  }

  activate(tab_) {
    for (const tab of this.tabs.toArray()) {
      tab.active = false;
    }
    tab_.active = true;
  }
}
