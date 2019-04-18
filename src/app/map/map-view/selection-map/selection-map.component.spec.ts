import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionMapComponent } from './selection-map.component';

describe('SelectionMapComponent', () => {
  let component: SelectionMapComponent;
  let fixture: ComponentFixture<SelectionMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
