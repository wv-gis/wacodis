import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonSelectionViewComponent } from './comparison-selection-view.component';

describe('ComparisonSelectionViewComponent', () => {
  let component: ComparisonSelectionViewComponent;
  let fixture: ComponentFixture<ComparisonSelectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonSelectionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonSelectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
