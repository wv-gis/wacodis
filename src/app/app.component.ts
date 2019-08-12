import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Language, SettingsService } from '@helgoland/core';
import localeDe from '@angular/common/locales/de';
import { D3TimeFormatLocaleService } from '@helgoland/d3';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ExtendedSettings } from 'src/app/settings/settings.service';

@Component({
  selector: 'wv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'wv';

  public languageList: Language[];
  public showNavBar: boolean = true;
  public reservoirs: any[]= null;
  constructor(private router: Router, translate: TranslateService, d3translate: D3TimeFormatLocaleService, 
    private route: ActivatedRoute, private settingsService: SettingsService<ExtendedSettings>) {
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


    d3translate.addTimeFormatLocale('de',
      {
        'dateTime': '%a %b %e %X %Y',
        'date': '%d-%m-%Y',
        'time': '%H:%M:%S',
        'periods': ['AM', 'PM'],
        'days': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        'shortDays': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        'months': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        'shortMonths': ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
      }
    );

  }

  ngOnInit(): void {
    this.reservoirs = this.settingsService.getSettings().reservoirs;
    this.router.events.subscribe((val) => {
      
            if (val instanceof NavigationEnd) {
              const urlParts: string[] = val.urlAfterRedirects.split("/");
              const reservoirIdCandidate = this.reservoirs.find(x => x.id == urlParts[urlParts.length - 1]);

              if(reservoirIdCandidate){
                const iframeCandidate = urlParts[urlParts.length-2];
                if(reservoirIdCandidate  && this.showNavBar && !iframeCandidate.endsWith('reports') ) {
                  this.showNavBar = !this.showNavBar;
                 }
                 else if(reservoirIdCandidate && !this.showNavBar && iframeCandidate.endsWith('reports')){
                   this.showNavBar = !this.showNavBar;
                 }
              }else if(!reservoirIdCandidate && val.url.endsWith('TS')){
                this.showNavBar = !this.showNavBar;
              }
             
             
                   
      }  });
  }

  checkSelection(route: string) {
    if (this.router.isActive(route, true)) {
      return false;

    }
    else {
      return true;
    }
  }

}
