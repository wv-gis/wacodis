import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import { Language } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
// import { LocalStorage } from '@helgoland/core';
// import { DatasetEmitService } from './services/dataset-emit.service';
import localeDe from '@angular/common/locales/de';

@Component({
  selector: 'wv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  defaultTitle = '';
  public languageList: Language[];
  constructor(private router: Router,private activatedRoute: ActivatedRoute, 
    private titleService: Title, translate: TranslateService){

      translate.setDefaultLang('de');
      translate.use('de');

      registerLocaleData(localeDe); 
       
       
         this.languageList = [ 
          { 
        label: 'Deutsch', 
             code: 'de' 
           }, 
           { 
           label: 'English', 
              code: 'en' 
           } 
        ]; 
    
       
        //  d3translate.addTimeFormatLocale('de', 
        //      { 
        //    'dateTime': '%a %b %e %X %Y', 
        //        'date': '%d-%m-%Y', 
        //       'time': '%H:%M:%S', 
        //        'periods': ['AM', 'PM'], 
        //       'days': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'], 
        //      'shortDays': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], 
        //      'months': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'], 
        //       'shortMonths': ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] 
        //    } 
        //    ); 
      
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

