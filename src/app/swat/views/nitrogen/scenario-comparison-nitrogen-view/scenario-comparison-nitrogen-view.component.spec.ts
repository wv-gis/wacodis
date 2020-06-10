import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioComparisonNitrogenViewComponent } from './scenario-comparison-nitrogen-view.component';

describe('ScenarioComparisonNitrogenViewComponent', () => {
  let component: ScenarioComparisonNitrogenViewComponent;
  let fixture: ComponentFixture<ScenarioComparisonNitrogenViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioComparisonNitrogenViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioComparisonNitrogenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
