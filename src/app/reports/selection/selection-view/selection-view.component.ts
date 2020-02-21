import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Timespan, SettingsService } from '@helgoland/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExtendedSettings } from 'src/app/settings/settings.service';

@Component({
  selector: 'wv-selection-view',
  templateUrl: './selection-view.component.html',
  styleUrls: ['./selection-view.component.scss']
})
export class SelectionViewComponent implements OnInit {

  @ViewChild('reportComponent', { static: false })
  public d3Elem: ElementRef;
  

  public serviceUrl: string = '';
  public dams: string[] = [];
  public diagram: boolean = false;
  public timespan: Timespan[] = [new Timespan(new Date().getTime())];
  public damLabel: string = 'Talsperre';

  public reservoirs: any;
  public g: any;
  public compSeriesMax: number = 0;
  public xaxisHeight: number;
  public unresolvableTimeseries: string[] = [];

  public resId: number = -1;
  public selected = false;

  constructor(
    private router: Router, private route: ActivatedRoute, private settingsSrvc: SettingsService<ExtendedSettings>) {
      


   this.reservoirs = settingsSrvc.getSettings().reservoirs;
   for (let i = 0; i < this.reservoirs.length; i++) {
     this.dams.push(this.reservoirs[i].label);
     if (!this.reservoirs[i].graph.compSeriesId) {
       this.unresolvableTimeseries.push(this.reservoirs[i].label);
     }
   }
   this.serviceUrl = settingsSrvc.getSettings().defaultService.apiUrl;
 }

 ngOnInit() {
   this.route.params.subscribe(params => {
     if (params["id"]) {
       for (let k = 0; k < this.reservoirs.length; k++) {
         if (params["id"] === this.reservoirs[k].id) {
           this.checkSelection(this.reservoirs[k].label, k);
         }
       }
     }
   });
 }

 onSelection(id: number) {
   
   this.router.navigate(['start', this.reservoirs[id].id]);

 }


 /**
   * define which reservoir the report should be created for
   * @param label label of the reservoir
   * @param id number in list of possible reservoirs
   */
 public checkSelection(label: string, id: number) {

  
   this.diagram = !this.diagram;
   this.timespan[0].from = new Date(new Date().getFullYear(), 0, 2).getTime() - 31556926000;
   this.timespan[0].to = new Date(new Date().getFullYear(), 1, 2).getTime() + 31556926000;

   this.timespan.splice(1);

   this.damLabel = label;
   // this.seriesId = this.reservoirs[id].graph.seriesId;
   this.resId = id;

   if (this.reservoirs[id].graph.compYearsFrom) {
     for (let y = 0; y < this.reservoirs[id].graph.compYearsFrom.length; y++) {
       this.timespan.push(new Timespan(new Date(this.reservoirs[id].graph.compYearsFrom[y],
         new Date(this.timespan[0].from).getMonth(), new Date(this.timespan[0].from).getDate()).getTime(),
         new Date(this.reservoirs[id].graph.compYearsFrom[y] + 2, new Date(this.timespan[0].to).getMonth()).getTime()));
     }
   }

 }
}
