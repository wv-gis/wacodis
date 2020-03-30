import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedVisibilityTogglerComponent } from './extended-visibility-toggler.component';

describe('ExtendedVisibilityTogglerComponent', () => {
  let component: ExtendedVisibilityTogglerComponent;
  let fixture: ComponentFixture<ExtendedVisibilityTogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedVisibilityTogglerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedVisibilityTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
