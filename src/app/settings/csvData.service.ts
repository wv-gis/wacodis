import { Injectable } from '@angular/core';
import {  tempData, tempDataDh } from '../../environments/environment';


@Injectable()
export class CsvDataService {
private headers;
private datasets: string;
private text: string;
private interpText;
    constructor() {
        // this.headers = headerArray;
        this.datasets = tempDataDh;
        this.text = tempData;
        // this.interpText = statData;
    }
    public getCsvDataset(){
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