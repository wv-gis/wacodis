import { WvMapModule } from './map.module';

describe('WvMapModule', () => {
  let mapModule: WvMapModule;

  beforeEach(() => {
    mapModule = new WvMapModule();
  });

  it('should create an instance', () => {
    expect(mapModule).toBeTruthy();
  });
});
