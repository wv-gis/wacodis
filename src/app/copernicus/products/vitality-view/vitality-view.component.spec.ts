import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalityViewComponent } from './vitality-view.component';

describe('VitalityViewComponent', () => {
  let component: VitalityViewComponent;
  let fixture: ComponentFixture<VitalityViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalityViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
