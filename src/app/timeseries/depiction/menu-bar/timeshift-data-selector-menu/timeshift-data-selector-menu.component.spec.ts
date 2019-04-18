import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeshiftDataSelectorMenuComponent } from './timeshift-data-selector-menu.component';

describe('TimeshiftDataSelectorMenuComponent', () => {
  let component: TimeshiftDataSelectorMenuComponent;
  let fixture: ComponentFixture<TimeshiftDataSelectorMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeshiftDataSelectorMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeshiftDataSelectorMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
