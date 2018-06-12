import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedListSelectorComponent } from './extended-list-selector.component';

describe('ExtendedListSelectorComponent', () => {
  let component: ExtendedListSelectorComponent;
  let fixture: ComponentFixture<ExtendedListSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedListSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
