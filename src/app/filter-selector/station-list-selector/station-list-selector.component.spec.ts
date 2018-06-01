import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationListSelectorComponent } from './station-list-selector.component';

describe('StationListSelectorComponent', () => {
  let component: StationListSelectorComponent;
  let fixture: ComponentFixture<StationListSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationListSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
