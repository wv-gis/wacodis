import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Station, Phenomenon, Category, Provider, IDataset, Feature, ParameterFilter, Service, DatasetService } from '@helgoland/core';
import { ListSelectorParameter, FilteredParameter } from '@helgoland/selector';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { DatasetEmitService } from '../../services/dataset-emit.service';




@Component({
  selector: 'wv-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
})

export class CategorySelectorComponent implements OnChanges {

  constructor( private datasetService: DatasetEmitService){
    // this.activatedRoute.queryParams.subscribe(params => {
    //   console.log('Parameter: ' + params.selectedService.apiUrl);
      // this.selectedProviderList.push({
      //   id: params.selectedService.id,
      //   url: params.selectedService.apiUrl
      // });
      // this.timespan = new Timespan(params.firstValueTime, params.lastValueTime);
  // });
  }
@Input()
selectedProvider: Service;


  public selectedProviderList: Provider[] = [];
  public categoryParams: ListSelectorParameter[] = [{
    type: 'category',
    header: 'Kategorie',
   
  }, {
    type: 'feature',
    header: 'Station',
   
  }, {
    type: 'phenomenon',
    header: 'Phänomen',
 
  }, {
    type: 'procedure',
    header: 'Sensor',
  
  }];


  public onDatasetSelected(datasets: IDataset[]) {

    // datasets.forEach((dataset) => {
    //   this.selectedDataset.emit(dataset);
    //   let navigationExtras: NavigationExtras = {
    //     queryParams: {
    //       datasetIdsMultiple: dataset.internalId,
    //     },
    //     skipLocationChange: true
    //   }
    //   console.log(dataset.internalId);
    //   this.router.navigate(['/timeseries'], navigationExtras);
    // });
    datasets.forEach((dataset) => {
      this.datasetService.addDataset(dataset.internalId);
      console.log('StationSelect: ' + dataset.internalId);
    })
    
  }

  // public getProviderUrl(service: Service) {
  //   

  //   this.selectedProviderList.push({
  //     id: service.id,
  //     url: service.apiUrl,
  //   });
  // }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes.selectedProvider.currentValue);
    if(this.selectedProvider){
      this.selectedProviderList = [];
      this.selectedProviderList.push({
        id: this.selectedProvider.id,
        url: this.selectedProvider.apiUrl,
      });

    }
  }

}
