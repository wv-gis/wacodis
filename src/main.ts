import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment, settingsPromise, tempDataPromise} from './environments/environment';
import { tempDataDhPromise } from './environments/environment.prod';


if (environment.production) {
  enableProdMode();
}

Promise.all([settingsPromise, tempDataPromise, tempDataDhPromise]).then((config: any) => {
  platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.log(err));
});
