import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandCoverComponent } from './land-cover.component';

describe('LandCoverComponent', () => {
  let component: LandCoverComponent;
  let fixture: ComponentFixture<LandCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
