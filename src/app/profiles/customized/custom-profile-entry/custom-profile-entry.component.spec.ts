import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomProfileEntryComponent } from './custom-profile-entry.component';

describe('CustomProfileEntryComponent', () => {
  let component: CustomProfileEntryComponent;
  let fixture: ComponentFixture<CustomProfileEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomProfileEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomProfileEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
