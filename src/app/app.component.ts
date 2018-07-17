import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
// import { LocalStorage } from '@helgoland/core';
// import { DatasetEmitService } from './services/dataset-emit.service';


@Component({
  selector: 'wv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  defaultTitle = '';
  constructor(private router: Router,private activatedRoute: ActivatedRoute, 
    private titleService: Title){

  }
  
  ngOnInit() {
    this.defaultTitle = this.titleService.getTitle();
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        this.setBrowserTitle();
      });
  }

  setBrowserTitle() {
    let title = this.defaultTitle;
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
      title = route.snapshot.data['title'] || title;
    }
    this.titleService.setTitle(title);
  }
}

