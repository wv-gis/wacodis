import { Injectable, EventEmitter } from "@angular/core";
import { IDataset } from "@helgoland/core";

@Injectable()
export class DatasetEmitService {

 dataEmit = new EventEmitter<IDataset>();

  constructor() { }

  sendMessage(data: IDataset) {
    this.dataEmit.emit(data);
  }
}