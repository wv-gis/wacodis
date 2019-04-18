import { Injectable } from '@angular/core';
import { LocalStorage } from '@helgoland/core';

@Injectable({
  providedIn: 'root'
})
export class ComparisonSelectionService {


  public selLayers = [];
  public selID: number[] = [];
  public selView: string = '';
  public selDate: Date[] = [];
  constructor(private localstorage: LocalStorage) { }


  setSelection(layers: Object[], id: number[], view: string, date: Date[]) {
    this.selLayers = layers;
    this.selID = id;
    this.selView = view;
    this.selDate = date;
    // this.saveSelectionState(layers, date, view);
  }

  getSelection(): Object[] {
    return [this.selLayers, this.selID, this.selView, this.selDate];
  }

  // saveSelectionState(layers: Object[], date: Date[], view: String) {
  //   this.localstorage.save('User', [layers, date, view]);
  // }
}
