import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WvDataViewComponent } from './wv-data-view.component';

describe('WvDataViewComponent', () => {
  let component: WvDataViewComponent;
  let fixture: ComponentFixture<WvDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WvDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WvDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
