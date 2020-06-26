import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalityPieChartComponent } from './vitality-pie-chart.component';

describe('VitalityPieChartComponent', () => {
  let component: VitalityPieChartComponent;
  let fixture: ComponentFixture<VitalityPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalityPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalityPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
