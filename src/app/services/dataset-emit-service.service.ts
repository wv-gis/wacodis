import { Injectable } from '@angular/core';
import { DatasetService, DatasetOptions, LocalStorage, DatasetApiInterface, LineRenderingHints, BarRenderingHints} from '@helgoland/core';


@Injectable({
  providedIn: 'root'
})
// export class DatasetEmitServiceService<T extends DatasetOptions | DatasetOptions[]> extends DatasetService<T> {
   export class DatasetEmitServiceService extends DatasetService<DatasetOptions> {
  dataOptions: DatasetOptions[];
  internID: string;
  // colorPromise: Promise<boolean>;

  constructor(protected localStorage: LocalStorage, protected api: DatasetApiInterface) {
    super();
  }

  protected createStyles(internalId: string): DatasetOptions {
    let option = new DatasetOptions(internalId, "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
  
    this.api.getSingleTimeseriesByInternalId(internalId).subscribe(
    
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
          // console.log(option.color + ' ChartType: ' + timeseries.renderingHints.chartType);
          // console.log('InternalID ' + internalId);
        }
      //  this.colorPromise =Promise.resolve(true);
      // return option as T;
      },
      (error) => {
        this.api.getDatasetByInternalId(internalId).subscribe(
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
            // this.colorPromise =Promise.resolve(true);
          },
        );
        // return option as T;
      } 
    ); 
    // if(this.colorPromise)
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