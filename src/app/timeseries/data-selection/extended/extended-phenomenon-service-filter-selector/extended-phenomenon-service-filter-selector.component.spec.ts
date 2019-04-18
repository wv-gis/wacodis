import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedPhenomenonServiceFilterSelectorComponent } from './extended-phenomenon-service-filter-selector.component';

describe('ExtendedPhenomenonServiceFilterSelectorComponent', () => {
  let component: ExtendedPhenomenonServiceFilterSelectorComponent;
  let fixture: ComponentFixture<ExtendedPhenomenonServiceFilterSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedPhenomenonServiceFilterSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedPhenomenonServiceFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
