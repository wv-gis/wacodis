import { Settings } from '@helgoland/core';
export const environment = {
  production: true
};
export let settings: Settings = {};
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
export let oxyData: string = '';
export const OxyDataPromise = new Promise((resolve, reject)=>{
 const input_ = new XMLHttpRequest();
 input_.open('GET', './assets/Dh_BojeA_Sauerst_2004.csv');
  input_.onload = (e)=>{
    if(input_.status === 200){
        oxyData = input_.responseText;

      resolve(oxyData);
      
    }
    else{
      reject('Cannot load csv file');
    }
  };
  input_.send();
});