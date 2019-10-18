import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedOlLayerLegendUrlComponent } from './extended-ol-layer-legend-url.component';

describe('ExtendedOlLayerLegendUrlComponent', () => {
  let component: ExtendedOlLayerLegendUrlComponent;
  let fixture: ComponentFixture<ExtendedOlLayerLegendUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedOlLayerLegendUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedOlLayerLegendUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
