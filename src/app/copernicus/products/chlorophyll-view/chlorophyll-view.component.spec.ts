import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChlorophyllViewComponent } from './chlorophyll-view.component';

describe('ChlorophyllViewComponent', () => {
  let component: ChlorophyllViewComponent;
  let fixture: ComponentFixture<ChlorophyllViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChlorophyllViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChlorophyllViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
