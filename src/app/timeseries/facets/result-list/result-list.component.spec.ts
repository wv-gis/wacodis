import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WvResultListComponent } from './result-list.component';

describe('ResultListComponent', () => {
  let component: WvResultListComponent;
  let fixture: ComponentFixture<WvResultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WvResultListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WvResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
