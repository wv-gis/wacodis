import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedOpacitySliderComponent } from './extended-opacity-slider.component';

describe('ExtendedOpacitySliderComponent', () => {
  let component: ExtendedOpacitySliderComponent;
  let fixture: ComponentFixture<ExtendedOpacitySliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedOpacitySliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedOpacitySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
