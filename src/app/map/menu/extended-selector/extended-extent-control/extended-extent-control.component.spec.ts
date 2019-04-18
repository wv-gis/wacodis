import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedExtentControlComponent } from './extended-extent-control.component';

describe('ExtendedExtentControlComponent', () => {
  let component: ExtendedExtentControlComponent;
  let fixture: ComponentFixture<ExtendedExtentControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedExtentControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedExtentControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
