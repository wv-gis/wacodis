import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleNitrogenResultViewComponent } from './single-nitrogen-result-view.component';

describe('SingleNitrogenResultViewComponent', () => {
  let component: SingleNitrogenResultViewComponent;
  let fixture: ComponentFixture<SingleNitrogenResultViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleNitrogenResultViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleNitrogenResultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
