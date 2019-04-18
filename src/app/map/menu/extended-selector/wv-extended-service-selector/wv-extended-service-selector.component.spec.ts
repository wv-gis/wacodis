import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WvExtendedServiceSelectorComponent } from './wv-extended-service-selector.component';

describe('WvExtendedServiceSelectorComponent', () => {
  let component: WvExtendedServiceSelectorComponent;
  let fixture: ComponentFixture<WvExtendedServiceSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WvExtendedServiceSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WvExtendedServiceSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
