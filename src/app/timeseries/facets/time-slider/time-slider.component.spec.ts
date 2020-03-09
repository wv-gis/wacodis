import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WvTimeSliderComponent } from './time-slider.component';

describe('TimeSliderComponent', () => {
  let component: WvTimeSliderComponent;
  let fixture: ComponentFixture<WvTimeSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WvTimeSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WvTimeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
