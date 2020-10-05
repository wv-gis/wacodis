import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerLegendCardComponent } from './layer-legend-card.component';

describe('LayerLegendCardComponent', () => {
  let component: LayerLegendCardComponent;
  let fixture: ComponentFixture<LayerLegendCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerLegendCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerLegendCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
