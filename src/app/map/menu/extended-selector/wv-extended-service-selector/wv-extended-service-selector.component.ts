import { Component } from '@angular/core';
import { ServiceSelectorComponent } from '@helgoland/selector';

@Component({
  selector: 'wv-extended-service-selector',
  templateUrl: './wv-extended-service-selector.component.html',
  styleUrls: ['./wv-extended-service-selector.component.css']
})
/**
 * Wrapper Component to set styling of ServiceSelector Component
 */
export class WvExtendedServiceSelectorComponent  extends ServiceSelectorComponent{

}
