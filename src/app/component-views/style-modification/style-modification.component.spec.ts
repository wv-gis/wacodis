import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleModificationComponent } from './style-modification.component';

describe('StyleModificationComponent', () => {
  let component: StyleModificationComponent;
  let fixture: ComponentFixture<StyleModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StyleModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StyleModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
