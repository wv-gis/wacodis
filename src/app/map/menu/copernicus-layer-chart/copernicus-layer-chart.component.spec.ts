import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopernicusLayerChartComponent } from './copernicus-layer-chart.component';

describe('CopernicusLayerChartComponent', () => {
  let component: CopernicusLayerChartComponent;
  let fixture: ComponentFixture<CopernicusLayerChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopernicusLayerChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopernicusLayerChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
