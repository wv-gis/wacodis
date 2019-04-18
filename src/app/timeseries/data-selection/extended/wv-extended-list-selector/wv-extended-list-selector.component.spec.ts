import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WvExtendedListSelectorComponent } from './wv-extended-list-selector.component';

describe('WvExtendedListSelectorComponent', () => {
  let component: WvExtendedListSelectorComponent;
  let fixture: ComponentFixture<WvExtendedListSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WvExtendedListSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WvExtendedListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
