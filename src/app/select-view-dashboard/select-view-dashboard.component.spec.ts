import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectViewDashboardComponent } from './select-view-dashboard.component';

describe('SelectViewDashboardComponent', () => {
  let component: SelectViewDashboardComponent;
  let fixture: ComponentFixture<SelectViewDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectViewDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectViewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
