import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedOlLayerZoomExtentComponent } from './extended-ol-layer-zoom-extent.component';

describe('ExtendedOlLayerZoomExtentComponent', () => {
  let component: ExtendedOlLayerZoomExtentComponent;
  let fixture: ComponentFixture<ExtendedOlLayerZoomExtentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedOlLayerZoomExtentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedOlLayerZoomExtentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
