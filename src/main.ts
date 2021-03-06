import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment, settingsPromise, tempDataPromise, rainDataDhPromise, rainDataBePromise, tempDataDhPromise} from './environments/environment';



if (environment.production) {
  enableProdMode();
}

Promise.all([settingsPromise, tempDataPromise, tempDataDhPromise,rainDataDhPromise,rainDataBePromise]).then((config: any) => {
  platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.log(err));
});
