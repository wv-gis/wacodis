import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedOlLayerTimeSelectorComponent } from './extended-ol-layer-time-selector.component';

describe('ExtendedOlLayerTimeSelectorComponent', () => {
  let component: ExtendedOlLayerTimeSelectorComponent;
  let fixture: ComponentFixture<ExtendedOlLayerTimeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedOlLayerTimeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedOlLayerTimeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
