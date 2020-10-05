import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixedDataChartComponent } from './mixed-data-chart.component';

describe('MixedDataChartComponent', () => {
  let component: MixedDataChartComponent;
  let fixture: ComponentFixture<MixedDataChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedDataChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedDataChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
