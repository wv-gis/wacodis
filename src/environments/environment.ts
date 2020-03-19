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



export let tempData: string = '';
export const tempDataPromise = new Promise((resolve, reject)=>{
 const input_n = new XMLHttpRequest();
 input_n.open('GET', './assets/Be_Sauerst_2013.csv');
  input_n.onload = (e)=>{
    if(input_n.status === 200){
      tempData = input_n.responseText;

      resolve(tempData);
      
    }
    else{
      reject('Cannot load csv file');
    }
  };
  input_n.send();
});
export var locale={moduleType:"locale",name:"de",dictionary:{Autoscale:"Automatische Skalierung","Box Select":"Rechteckauswahl","Click to enter Colorscale title":
"Klicken, um den Farbskalatitel einzugeben","Click to enter Component A title":"Klicken, um den Titel der Komponente A einzugeben","Click to enter Component B title":
"Klicken, um den Titel der Komponente B einzugeben","Click to enter Component C title":"Klicken, um den Titel der Komponente C einzugeben","Click to enter Plot title":
"Klicken, um den Titel des Graphen einzugeben","Click to enter X axis title":"Klicken, um den Titel der X-Achse einzugeben","Click to enter Y axis title":
"Klicken, um den Titel der Y-Achse einzugeben","Compare data on hover":"\xdcber die Daten fahren, um sie zu vergleichen","Double-click on legend to isolate one trace":
"Daten isolieren durch Doppelklick in der Legende","Double-click to zoom back out":"Herauszoomen durch Doppelklick","Download plot as a png":"Graphen als PNG herunterladen",
"Download plot":"Graphen herunterladen","Edit in Chart Studio":"Im Chart Studio bearbeiten","IE only supports svg.  Changing format to svg.":
"IE unterst\xfctzt nur SVG-Dateien.  Format wird zu SVG gewechselt.","Lasso Select":"Lassoauswahl","Orbital rotation":"Orbitalrotation",Pan:
"Verschieben","Produced with Plotly":"Erstellt mit Plotly",Reset:"Zur\xfccksetzen","Reset axes":"Achsen zur\xfccksetzen","Reset camera to default":
"Kamera auf Standard zur\xfccksetzen","Reset camera to last save":"Kamera auf letzte Speicherung zur\xfccksetzen","Reset view":"Ansicht zur\xfccksetzen",
"Reset views":"Ansichten zur\xfccksetzen","Show closest data on hover":"Zeige n\xe4heste Daten beim \xdcberfahren","Snapshot succeeded":"Snapshot erfolgreich",
"Sorry, there was a problem downloading your snapshot!":"Es gab ein Problem beim Herunterladen des Snapshots","Taking snapshot - this may take a few seconds":
"Erstelle einen Snapshot - dies kann einige Sekunden dauern",Zoom:"Zoom","Zoom in":"Hineinzoomen","Zoom out":"Herauszoomen","close:":"Schluss:",trace:"Datenspur",
"lat:":"Lat.:","lon:":"Lon.:","q1:":"q1:","q3:":"q3:","source:":"Quelle:","target:":"Ziel:","lower fence:":"Untere Schranke:","upper fence:":"Obere Schranke:",
"max:":"Max.:","mean \xb1 \u03c3:":"Mittelwert \xb1 \u03c3:","mean:":"Mittelwert:","median:":"Median:","min:":"Min.:","Turntable rotation":"Drehscheibenorbit",
"Toggle Spike Lines":"Bezugslinien an-/abschalten","open:":"Er\xf6ffnung:","high:":"H\xf6chstkurs:","low:":"Tiefstkurs:","Toggle show closest data on hover":
"Anzeige der n\xe4hesten Daten an-/abschalten","incoming flow count:":"Anzahl eingehender Verbindungen:","outgoing flow count:":"Anzahl ausgehender Verbindungen:",
"kde:":"Dichte:"},format:{days:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],shortDays:["So","Mo","Di","Mi","Do","Fr","Sa"],
months:["Januar","Februar","M\xe4rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
shortMonths:["Jan","Feb","M\xe4r","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],date:"%d.%m.%Y",decimal:",",thousands:"."}};