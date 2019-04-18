import { Settings } from "@helgoland/core";

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export let settings: Settings ={} ;
export const settingsPromise = new Promise<Settings>((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', './assets/settings.json');
  xhr.onload = () => {
    if (xhr.status === 200) {
       settings = JSON.parse(xhr.responseText);
      resolve(settings);
      
    } else {
       reject('Cannot load configuration');
    }
  };
  xhr.send();
});

export let csvData: string = '';
export const dataPromise = new Promise((resolve, reject)=>{
 const input = new XMLHttpRequest();
 input.open('GET', './assets/GDT_2014.csv');
  input.onload = (e)=>{
    if(input.status === 200){
        csvData = input.responseText;
      //  let csvRecordsArray = csvData.split(/\r\n|\n/);

      //  let header = csvRecordsArray[0].split(';');
      //  for(let j = 0; j< header.length; j++){
      //   headerArray.push(header[j]);
      //  }
      //  for(let k = 1; k< csvRecordsArray.length; k++){
      //   let dataArr = csvRecordsArray[k].split(';');
      //   let col = [];
      //   for(let i = 0; i<dataArr.length; i++){
      //     col.push(dataArr[i]);
      //   }
      //   data.push(col);
      //  }
       
      //   resolve({headerArray,data});
      resolve(csvData);
      
    }
    else{
      reject('Cannot load csv file');
    }
  };
  input.send();
});