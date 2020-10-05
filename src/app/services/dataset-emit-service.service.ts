import { Injectable } from '@angular/core';
import { DatasetService, DatasetOptions, LocalStorage, LineRenderingHints, BarRenderingHints, HelgolandServicesConnector, DatasetType} from '@helgoland/core';

/**
 * Extends DatasetService
 * service to set the styling of reference Values of selected Datasets
 */
@Injectable({
  providedIn: 'root'
})
   export class DatasetEmitServiceService extends DatasetService<DatasetOptions> {
  dataOptions: DatasetOptions[];
  internID: string;
 

  constructor(protected localStorage: LocalStorage, protected api: HelgolandServicesConnector) {
    super();
  }

  protected createStyles(internalId: string): DatasetOptions {
    let option = new DatasetOptions(internalId, "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
  
    this.api.getDataset(internalId,{type: DatasetType.Timeseries}).subscribe(
    
      (timeseries) => {
        // option = new DatasetOptions(internalId, "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
        if (timeseries.renderingHints) {
          if (timeseries.renderingHints.properties && timeseries.renderingHints.properties.color) {
            option.color = timeseries.renderingHints.properties.color;
            
          }
          switch (timeseries.renderingHints.chartType) {
            case 'line':
                this.handleLineRenderingHints(timeseries.renderingHints as LineRenderingHints, option);
                break;
            case 'bar':
                this.handleBarRenderingHints(timeseries.renderingHints as BarRenderingHints, option);
                break;
            default:
                break;
        }
    
        }
   
      },
      (error) => {
        this.api.getDataset(internalId,{type: DatasetType.Timeseries}).subscribe(
          (dataset) => {
            if (dataset.renderingHints) {
              if (dataset.renderingHints.properties && dataset.renderingHints.properties.color) {
                option.color = dataset.renderingHints.properties.color;
              }
              switch (dataset.renderingHints.chartType) {
                case 'line':
                    this.handleLineRenderingHints(dataset.renderingHints as LineRenderingHints, option);
                    break;
                case 'bar':
                    this.handleBarRenderingHints(dataset.renderingHints as BarRenderingHints, option);
                    break;
                default:
                    break;
            }
              console.log(option.color + ' ChartType: ' + dataset.renderingHints.chartType);
            }
          
          },
        );
     
      } 
    ); 
   
    return option ;
  }

  protected saveState(): void {
    // this.datasetOptions.forEach((entry) => {
    //   if (entry[0]) {
    //     this.internID = entry[0].internalId
    //   }
    // });

    // this.localStorage.save(this.datasetIds.indexOf(this.internID).toString(), this.datasetOptions);
  }
  protected loadState(): void {
    // return this.localStorage.load(this.internID);
  }

  private handleLineRenderingHints(lineHints: LineRenderingHints, options: DatasetOptions) {
    if (lineHints.properties.width) {
        options.lineWidth = Math.round(parseFloat(lineHints.properties.width));
    }
}

private handleBarRenderingHints(barHints: BarRenderingHints, options: DatasetOptions) {
    if (barHints.properties.width) {
        options.lineWidth = Math.round(parseFloat(barHints.properties.width));
        console.log('Width: ' + options.lineWidth);
    }
}
}