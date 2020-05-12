import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopernicusBarChartCardComponent } from './copernicus-bar-chart-card.component';

describe('CopernicusBarChartCardComponent', () => {
  let component: CopernicusBarChartCardComponent;
  let fixture: ComponentFixture<CopernicusBarChartCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopernicusBarChartCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopernicusBarChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
