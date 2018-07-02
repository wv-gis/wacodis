import { TestBed, inject } from '@angular/core/testing';

import { DatasetEmitService } from './dataset-emit.service';
import { LocalStorage } from '@helgoland/core';

describe('DatasetEmitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatasetEmitService, LocalStorage]
    });
  });

  it('should be created', inject([DatasetEmitService], (service: DatasetEmitService) => {
    expect(service).toBeTruthy();
  }));
});
