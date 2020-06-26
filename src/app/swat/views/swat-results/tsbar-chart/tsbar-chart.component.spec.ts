import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TSBarChartComponent } from './tsbar-chart.component';

describe('TSBarChartComponent', () => {
  let component: TSBarChartComponent;
  let fixture: ComponentFixture<TSBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TSBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TSBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
