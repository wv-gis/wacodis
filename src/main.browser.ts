import { Settings } from '@helgoland/core';

export let settings: Settings;
export const settingsPromise = new Promise<Settings>((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', './assets/settings.json');
  xhr.onload = () => {
    if (xhr.status === 200) {
      settings = JSON.parse(xhr.responseText);
      console.log('Settings: ' + settings.datasetApis);
      resolve(settings);
    } else {
      reject('Cannot load configuration');
    }
  };
  xhr.send();
});

