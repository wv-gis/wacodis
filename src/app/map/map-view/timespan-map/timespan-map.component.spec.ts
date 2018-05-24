import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimespanMapComponent } from './timespan-map.component';

describe('TimespanMapComponent', () => {
  let component: TimespanMapComponent;
  let fixture: ComponentFixture<TimespanMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimespanMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimespanMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
