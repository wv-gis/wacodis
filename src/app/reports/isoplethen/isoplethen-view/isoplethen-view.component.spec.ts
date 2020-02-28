import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsoplethenViewComponent } from './isoplethen-view.component';

describe('IsoplethenViewComponent', () => {
  let component: IsoplethenViewComponent;
  let fixture: ComponentFixture<IsoplethenViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsoplethenViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsoplethenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
