import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WvParameterFacetComponent } from './parameter-facet.component';

describe('ParameterFacetComponent', () => {
  let component: WvParameterFacetComponent;
  let fixture: ComponentFixture<WvParameterFacetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WvParameterFacetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WvParameterFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
