import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioComparisonViewComponent } from './scenario-comparison-view.component';

describe('ScenarioComparisonViewComponent', () => {
  let component: ScenarioComparisonViewComponent;
  let fixture: ComponentFixture<ScenarioComparisonViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioComparisonViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioComparisonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
