import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MowingViewComponent } from './mowing-view.component';

describe('MowingViewComponent', () => {
  let component: MowingViewComponent;
  let fixture: ComponentFixture<MowingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MowingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MowingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
