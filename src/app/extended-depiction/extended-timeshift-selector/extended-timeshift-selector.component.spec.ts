import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedTimeshiftSelectorComponent } from './extended-timeshift-selector.component';

describe('ExtendedTimeshiftSelectorComponent', () => {
  let component: ExtendedTimeshiftSelectorComponent;
  let fixture: ComponentFixture<ExtendedTimeshiftSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedTimeshiftSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedTimeshiftSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
