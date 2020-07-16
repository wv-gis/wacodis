import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wv-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
/**
 * Landing Page Component as the default access point where the different parts of the web app are explained
 * manages the optional cookie bar
 */
export class LandingpageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  onCloseHandled(){
    document.getElementById('cookie-bar').setAttribute('style','display: none;');
  }
}
