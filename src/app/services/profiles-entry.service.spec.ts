import { TestBed } from '@angular/core/testing';

import { ProfilesEntryService } from './profiles-entry.service';

describe('ProfilesEntryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfilesEntryService = TestBed.get(ProfilesEntryService);
    expect(service).toBeTruthy();
  });
});
