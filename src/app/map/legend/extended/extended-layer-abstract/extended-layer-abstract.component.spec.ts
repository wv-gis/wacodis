import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedLayerAbstractComponent } from './extended-layer-abstract.component';

describe('ExtendedLayerAbstractComponent', () => {
  let component: ExtendedLayerAbstractComponent;
  let fixture: ComponentFixture<ExtendedLayerAbstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedLayerAbstractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedLayerAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
