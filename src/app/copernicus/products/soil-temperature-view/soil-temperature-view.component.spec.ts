import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilTemperatureViewComponent } from './soil-temperature-view.component';

describe('SoilTemperatureViewComponent', () => {
  let component: SoilTemperatureViewComponent;
  let fixture: ComponentFixture<SoilTemperatureViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoilTemperatureViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoilTemperatureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
