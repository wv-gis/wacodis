import { TestBed, inject } from '@angular/core/testing';

import { ComparisonSelectionService } from './comparison-selection.service';

describe('ComparisonSelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComparisonSelectionService]
    });
  });

  it('should be created', inject([ComparisonSelectionService], (service: ComparisonSelectionService) => {
    expect(service).toBeTruthy();
  }));
});
