import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsoplethenGraphicComponent } from './isoplethen-graphic.component';

describe('IsoplethenGraphicComponent', () => {
  let component: IsoplethenGraphicComponent;
  let fixture: ComponentFixture<IsoplethenGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsoplethenGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsoplethenGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
