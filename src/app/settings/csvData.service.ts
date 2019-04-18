import { Injectable } from '@angular/core';
import { csvData } from '../../environments/environment';

@Injectable()
export class CsvDataService {
private headers;
private datasets;
private text;
    constructor() {
        // this.headers = headerArray;
        // this.datasets = data;
        this.text = csvData;
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
}