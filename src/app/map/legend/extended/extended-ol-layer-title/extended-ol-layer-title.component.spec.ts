import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedOlLayerTitleComponent } from './extended-ol-layer-title.component';

describe('ExtendedOlLayerTitleComponent', () => {
  let component: ExtendedOlLayerTitleComponent;
  let fixture: ComponentFixture<ExtendedOlLayerTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedOlLayerTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedOlLayerTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
