import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedOlLayerAnimateTimeComponent } from './extended-ol-layer-animate-time.component';

describe('ExtendedOlLayerAnimateTimeComponent', () => {
  let component: ExtendedOlLayerAnimateTimeComponent;
  let fixture: ComponentFixture<ExtendedOlLayerAnimateTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedOlLayerAnimateTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedOlLayerAnimateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
