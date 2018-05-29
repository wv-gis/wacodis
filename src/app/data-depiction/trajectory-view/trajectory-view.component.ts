import { Component, OnInit } from '@angular/core';
import { LineString, GeoJsonObject, Point } from 'geojson';
import { DatasetOptions, Timespan, ColorService, InternalIdHandler, DatasetApiInterface, LocatedTimeValueEntry } from '@helgoland/core';
import { D3SelectionRange, D3GraphOptions, D3AxisType } from '@helgoland/d3';

@Component({
  selector: 'wv-trajectory-view',
  templateUrl: './trajectory-view.component.html',
  styleUrls: ['./trajectory-view.component.scss']
})
export class TrajectoryViewComponent implements OnInit {
  public geometry: LineString;

  public highlightGeometry: GeoJsonObject;

  public datasetIds: string[] = [
      'http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity_1',
      // 'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125100',
      // 'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125101',
      // 'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125102',
      // 'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125103',
      // 'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125104'
  ];

  public options: Map<string, DatasetOptions> = new Map();

  public timespan: Timespan;

  public selection: D3SelectionRange;

  public zoomToGeometry: GeoJsonObject;

  public graphOptions: D3GraphOptions = {
      axisType: D3AxisType.Distance,
      dotted: true
  };

  constructor(
      private color: ColorService,
      // private dialog: MatDialog,
      private internalIdHandler: InternalIdHandler,
      private api: DatasetApiInterface
  ) { }

  public ngOnInit(): void {

      this.datasetIds.forEach((entry) => {
          const option = new DatasetOptions(entry, this.color.getColor());
          option.visible = true;
          this.options.set(entry, option);
      });

      if (this.datasetIds.length > 0) {
          const internalId = this.internalIdHandler.resolveInternalId(this.datasetIds[0]);
          this.api.getDataset(internalId.id, internalId.url).subscribe((dataset) => {
              this.timespan = new Timespan(dataset.firstValue.timestamp, dataset.lastValue.timestamp);
              this.api.getData<LocatedTimeValueEntry>(internalId.id, internalId.url, this.timespan)
                  .subscribe((data) => {
                      this.geometry = {
                          type: 'LineString',
                          coordinates: []
                      };
                      data.values.forEach((entry) => this.geometry.coordinates.push(entry.geometry.coordinates));
                  });
          });
      }
  }

  public onChartHighlightChanged(idx: number) {
      this.highlightGeometry = {
          type: 'Point',
          coordinates: this.geometry.coordinates[idx]
      } as Point;
  }

  public onChartSelectionChangedFinished(range: D3SelectionRange) {
      this.selection = range;
      this.zoomToGeometry = {
          type: 'LineString',
          coordinates: this.geometry.coordinates.slice(range.from, range.to)
      } as LineString;
  }

  public onChartSelectionChanged(range: D3SelectionRange) {
      this.highlightGeometry = {
          type: 'LineString',
          coordinates: this.geometry.coordinates.slice(range.from, range.to)
      } as LineString;
  }

  // public editOptions(option: DatasetOptions) {
  //     const dialogRef = this.dialog.open(StyleModificationComponent, {
  //         data: option
  //     });
  // }


}
