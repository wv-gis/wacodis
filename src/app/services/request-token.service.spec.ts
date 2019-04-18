import { TestBed, inject } from '@angular/core/testing';

import { RequestTokenService } from './request-token.service';

describe('RequestTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestTokenService]
    });
  });

  it('should be created', inject([RequestTokenService], (service: RequestTokenService) => {
    expect(service).toBeTruthy();
  }));
});
