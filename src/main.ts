import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment, settingsPromise, dataPromise,OxyDataPromise } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

Promise.all([settingsPromise, dataPromise,OxyDataPromise]).then((config: any) => {
  platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.log(err));
});
