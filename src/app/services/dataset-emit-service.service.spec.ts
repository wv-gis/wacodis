import { TestBed, inject } from '@angular/core/testing';

import { DatasetEmitServiceService } from './dataset-emit-service.service';
import { DatasetOptions } from '@helgoland/core';

describe('DatasetEmitServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatasetEmitServiceService]
    });
  });

  it('should be created', inject([DatasetEmitServiceService], (service: DatasetEmitServiceService) => {
    expect(service).toBeTruthy();
  }));
});
