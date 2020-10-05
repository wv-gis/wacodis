import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerLegendTableComponent } from './layer-legend-table.component';

describe('LayerLegendTableComponent', () => {
  let component: LayerLegendTableComponent;
  let fixture: ComponentFixture<LayerLegendTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerLegendTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerLegendTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
