import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEntryGraphComponent } from './profile-entry-graph.component';

describe('ProfileEntryGraphComponent', () => {
  let component: ProfileEntryGraphComponent;
  let fixture: ComponentFixture<ProfileEntryGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEntryGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEntryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
