import { WvChangeDetectionModule } from './change-detection.module';

describe('WvChangeDetectionModule', () => {
  let changeDetectionModule: WvChangeDetectionModule;

  beforeEach(() => {
    changeDetectionModule = new WvChangeDetectionModule();
  });

  it('should create an instance', () => {
    expect(changeDetectionModule).toBeTruthy();
  });
});
