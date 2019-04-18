import { TestBed, inject } from '@angular/core/testing';

import { SelectedProviderService } from './selected-provider.service';

describe('SelectedProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectedProviderService]
    });
  });

  it('should be created', inject([SelectedProviderService], (service: SelectedProviderService) => {
    expect(service).toBeTruthy();
  }));
});
