import { WvProfilesModule } from './profiles.module';

describe('WvProfilesModule', () => {
  let profilesModule: WvProfilesModule;

  beforeEach(() => {
    profilesModule = new WvProfilesModule();
  });

  it('should create an instance', () => {
    expect(profilesModule).toBeTruthy();
  });
});
