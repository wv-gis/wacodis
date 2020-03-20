import { Injectable } from '@angular/core';
import {  tempData } from '../../environments/environment';


@Injectable()
export class CsvDataService {
private headers;
private datasets;
private text;
private interpText;
    constructor() {
        // this.headers = headerArray;
        // this.datasets = data;
        this.text = tempData;
        // this.interpText = statData;
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