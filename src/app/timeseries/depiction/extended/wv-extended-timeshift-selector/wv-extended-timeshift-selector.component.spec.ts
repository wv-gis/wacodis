import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WvExtendedTimeshiftSelectorComponent } from './wv-extended-timeshift-selector.component';

describe('WvExtendedTimeshiftSelectorComponent', () => {
  let component: WvExtendedTimeshiftSelectorComponent;
  let fixture: ComponentFixture<WvExtendedTimeshiftSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WvExtendedTimeshiftSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WvExtendedTimeshiftSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
