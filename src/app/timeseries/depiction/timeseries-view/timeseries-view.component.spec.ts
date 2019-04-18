import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeseriesViewComponent } from './timeseries-view.component';

describe('TimeseriesViewComponent', () => {
  let component: TimeseriesViewComponent;
  let fixture: ComponentFixture<TimeseriesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeseriesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
