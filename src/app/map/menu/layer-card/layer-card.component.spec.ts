import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerCardComponent } from './layer-card.component';

describe('LayerCardComponent', () => {
  let component: LayerCardComponent;
  let fixture: ComponentFixture<LayerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
