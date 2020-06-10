import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleResultViewComponent } from './single-result-view.component';

describe('SingleResultViewComponent', () => {
  let component: SingleResultViewComponent;
  let fixture: ComponentFixture<SingleResultViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleResultViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleResultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
