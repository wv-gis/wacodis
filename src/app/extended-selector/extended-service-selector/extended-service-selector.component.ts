import { Component } from '@angular/core';
import { ServiceSelectorComponent, ServiceSelectorService } from '@helgoland/selector';



@Component({
    selector: 'wv-extended-service-selector',
    styleUrls: ['./extended-service-selector.component.scss'],
    templateUrl: './extended-service-selector.component.html',
})

export class ExtendedServiceSelectorComponent extends ServiceSelectorComponent{

        constructor(protected serviceSelectorService: ServiceSelectorService){
            super(serviceSelectorService);
        }
}