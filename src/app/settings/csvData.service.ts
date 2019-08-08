import { Injectable } from '@angular/core';
import { csvData, oxyData } from '../../environments/environment';

@Injectable()
export class CsvDataService {
private headers;
private datasets;
private text;
private interpText;
    constructor() {
        // this.headers = headerArray;
        // this.datasets = data;
        this.text = csvData;
        this.interpText = oxyData;
    }
    public getCsvDatasets(){
        return this.datasets;
    }
    public getHeaders(){
        return this.headers;
    }
 public getCsvText(){
     return this.text;
 }
 public getInterpText(){
     return this.interpText;
 }
}