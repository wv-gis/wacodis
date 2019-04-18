import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WvExtendedMultiserviceFilterSelectorComponent } from './wv-extended-multiservice-filter-selector.component';

describe('WvExtendedMultiserviceFilterSelectorComponent', () => {
  let component: WvExtendedMultiserviceFilterSelectorComponent;
  let fixture: ComponentFixture<WvExtendedMultiserviceFilterSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WvExtendedMultiserviceFilterSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WvExtendedMultiserviceFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
