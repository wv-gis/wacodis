import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDataViewSelectionComponent } from './profile-data-view-selection.component';

describe('ProfileDataViewSelectionComponent', () => {
  let component: ProfileDataViewSelectionComponent;
  let fixture: ComponentFixture<ProfileDataViewSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileDataViewSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDataViewSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
