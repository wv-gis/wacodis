import { WvReportsModule } from './reports.module';

describe('ReportsModule', () => {
  let reportsModule: WvReportsModule;

  beforeEach(() => {
    reportsModule = new WvReportsModule();
  });

  it('should create an instance', () => {
    expect(reportsModule).toBeTruthy();
  });
});
