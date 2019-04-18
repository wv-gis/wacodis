import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WvExtendedTimeseriesEntryComponent } from './wv-extended-timeseries-entry.component';

describe('WvExtendedTimeseriesEntryComponent', () => {
  let component: WvExtendedTimeseriesEntryComponent;
  let fixture: ComponentFixture<WvExtendedTimeseriesEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WvExtendedTimeseriesEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WvExtendedTimeseriesEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
