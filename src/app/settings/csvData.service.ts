import { Injectable } from '@angular/core';
import {  tempData, tempDataDh, rainDataBe, rainDataDh } from '../../environments/environment';


@Injectable()
export class CsvDataService {
private rainData;
private datasets: string;
private text: string;
private rainDataD;
    constructor() {
        this.rainData = rainDataBe;
        this.datasets = tempDataDh;
        this.text = tempData;
        this.rainDataD = rainDataDh;
    }
    public getTempDhDataset(){
        return this.datasets;
    }
    public getRainDataset(){
        return this.rainData;
    }
 public getTempDatasetText(){
     return this.text;
 }
 public getRainDhDataset(){
     return this.rainDataD;
 }
}