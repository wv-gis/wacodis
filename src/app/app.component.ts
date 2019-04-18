import { Component } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '@helgoland/core';
import localeDe from '@angular/common/locales/de';
import { D3TimeFormatLocaleService } from '@helgoland/d3';
import { Router } from '@angular/router';

@Component({
  selector: 'wv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wv';

  public languageList: Language[];
  constructor(private router: Router, translate: TranslateService, d3translate: D3TimeFormatLocaleService) {
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
  checkSelection(route: string) {
    if (this.router.isActive(route, true)) {
      return false;

    }
    else {
      return true;
    }
  }

}
