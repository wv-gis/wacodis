import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPlotlyProfileGraphComponent } from './custom-plotly-profile-graph.component';

describe('CustomPlotlyProfileGraphComponent', () => {
  let component: CustomPlotlyProfileGraphComponent;
  let fixture: ComponentFixture<CustomPlotlyProfileGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomPlotlyProfileGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPlotlyProfileGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
