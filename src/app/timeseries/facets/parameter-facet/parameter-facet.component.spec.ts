import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterFacetComponent } from './parameter-facet.component';

describe('ParameterFacetComponent', () => {
  let component: ParameterFacetComponent;
  let fixture: ComponentFixture<ParameterFacetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterFacetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
