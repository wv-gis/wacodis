import { Component, OnInit, IterableDiffers } from '@angular/core';
import { PlotlyProfileGraphComponent } from '@helgoland/plotly';
import { DatasetApiInterface, InternalIdHandler, Time, ProfileDataEntry, IDataset } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wv-custom-plotly-profile-graph',
  templateUrl: './custom-plotly-profile-graph.component.html',
  styleUrls: ['./custom-plotly-profile-graph.component.css']
})
export class CustomPlotlyProfileGraphComponent extends PlotlyProfileGraphComponent implements OnInit {

  constructor(protected iterableDiffers: IterableDiffers,
    protected api: DatasetApiInterface,
    protected datasetIdResolver: InternalIdHandler,
    protected timeSrvc: Time,
    protected translateSrvc: TranslateService) {
    super(iterableDiffers, api, datasetIdResolver, timeSrvc, translateSrvc);
  }

  ngOnInit() {


  }
}
