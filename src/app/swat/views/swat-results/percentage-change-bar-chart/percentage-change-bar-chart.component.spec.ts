import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageChangeBarChartComponent } from './percentage-change-bar-chart.component';

describe('PercentageChangeBarChartComponent', () => {
  let component: PercentageChangeBarChartComponent;
  let fixture: ComponentFixture<PercentageChangeBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentageChangeBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageChangeBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
