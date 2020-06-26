import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalityBarChartComponent } from './vitality-bar-chart.component';

describe('VitalityBarChartComponent', () => {
  let component: VitalityBarChartComponent;
  let fixture: ComponentFixture<VitalityBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalityBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalityBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
