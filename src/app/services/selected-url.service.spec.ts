import { TestBed, inject } from '@angular/core/testing';

import { SelectedUrlService } from './selected-url.service';

describe('SelectedUrlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectedUrlService]
    });
  });

  it('should be created', inject([SelectedUrlService], (service: SelectedUrlService) => {
    expect(service).toBeTruthy();
  }));
});
