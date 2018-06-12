import { Component, Input, EventEmitter, Output } from "@angular/core";
import { Provider, IDataset } from "@helgoland/core";
import { ListSelectorParameter } from "@helgoland/selector";

@Component({
    selector: 'wv-category-entry',
    templateUrl: './category-entry.component.html',
    // styleUrls: ['./category-selector.component.scss'],
  })

  export class CategoryEntryComponent {

    @Input()
    selectedProviderList: Provider[];
    @Output()
    selectedDataset: EventEmitter<IDataset> = new EventEmitter<IDataset>();
    
    public categoryParams: ListSelectorParameter[] = [{
        type: 'category',
        header: 'Kategorie'
      }, {
        type: 'feature',
        header: 'Station'
      }, {
        type: 'phenomenon',
        header: 'Phänomen'
      }, {
        type: 'procedure',
        header: 'Sensor'
      }];

      public onDatasetSelected(datasets: IDataset[]) {
        datasets.forEach((dataset) => {
          this.selectedDataset.emit(dataset);
          console.log('Select Dataset: ' + dataset.label + ' with ID: ' + dataset.id);
        });
       
      }
  }