import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RasterMapComponent } from './raster-map.component';

describe('RasterMapComponent', () => {
  let component: RasterMapComponent;
  let fixture: ComponentFixture<RasterMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RasterMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RasterMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
