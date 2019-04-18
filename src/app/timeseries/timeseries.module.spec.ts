import { WvTimeseriesModule } from './timeseries.module';

describe('WvTimeseriesModule', () => {
  let timeseriesModule: WvTimeseriesModule;

  beforeEach(() => {
    timeseriesModule = new WvTimeseriesModule();
  });

  it('should create an instance', () => {
    expect(timeseriesModule).toBeTruthy();
  });
});
