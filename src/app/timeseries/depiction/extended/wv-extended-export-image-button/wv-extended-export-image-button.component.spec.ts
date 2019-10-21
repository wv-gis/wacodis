import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WvExtendedExportImageButtonComponent } from './wv-extended-export-image-button.component';

describe('WvExtendedExportImageButtonComponent', () => {
  let component: WvExtendedExportImageButtonComponent;
  let fixture: ComponentFixture<WvExtendedExportImageButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WvExtendedExportImageButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WvExtendedExportImageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
