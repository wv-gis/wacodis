import { Component, OnInit } from '@angular/core';
import { PlatformTypes, Timespan, DatasetApiInterface, ColorService, DataParameterFilter, SettingsService } from '@helgoland/core';
import { ExtendedSettings, ReportReferenceValues } from 'src/app/settings/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as d3 from 'd3';
declare var require: any;

@Component({
  selector: 'wv-reports-view',
  templateUrl: './reports-view.component.html',
  styleUrls: ['./reports-view.component.css']
})
export class ReportsViewComponent implements OnInit {

  public serviceUrl: string = '';
  public dams: string[] = [];
  public filter: DataParameterFilter = {
    phenomenon: '10',// Speicherinhalt
    platformTypes: PlatformTypes.stationary,
    service: this.serviceUrl,
    expanded: true,
    generalize: true,
  };
  public rainFilter: DataParameterFilter = {
    phenomenon: '4',// id=4 Niederschlag
    platformTypes: PlatformTypes.stationary,
    service: this.serviceUrl,
    generalize: false,
  };

  public diagram: boolean = false;
  public timespan: Timespan[] = [new Timespan(new Date().getTime())];
  public damLabel: string = 'Talsperre';
  public damId: string = '';
  public refValues: ReportReferenceValues[] = [];
  public seriesId: string = '';
  public compSeriesId: string = '';
  public rainSeriesId: string = '';
  public intervals: Date[] = [];
  public values: number[] = [];
  public loading: boolean;
  public reservoirs;
  public g;
  public compSeriesMax: number = 0;
  public width: number;

  constructor(private datasetApi: DatasetApiInterface, private colSrvc: ColorService,
    private settingsService: SettingsService<ExtendedSettings>, private route: ActivatedRoute, private router: Router) {

    if (settingsService.getSettings().reservoirs) {
      this.reservoirs = settingsService.getSettings().reservoirs;
      for (let i = 0; i < this.reservoirs.length; i++) {
        this.dams.push(this.reservoirs[i].label);
      }

    }
    this.serviceUrl = settingsService.getSettings().datasetApis[3].url;

  }

  ngOnInit(): void {
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

  /**
   * generate the diagram for the report of the selected reservoir
   */
  public generateReport() {
    this.loading = true;

    const svgWidth = 1650, svgHeight = 620;
    const margin = { top: 30, right: 150, bottom: 30, left: 50 };
    let graphData = [];
    this.width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;
    let xaxisHeight = svgHeight - margin.bottom;
    let svgCont = d3.select('#reports').append("div")
      .classed("svg-container", true);
    let svg = svgCont.append("svg")
      .attr("viewBox", '0 0 ' + svgWidth + ' ' + svgHeight)
      .attr("version", "1.1")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
      .attr("xmlns:html", "http://www.w3.org/1999/xhtml")
      .attr('width', svgWidth + 100)
      .attr('height', svgHeight)
      .classed("svg-content-responsive", true);


    //set the boundings of the graph
    let g = svg.append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")"
      );
    //set scale of x and y axis
    let x = d3.scaleTime().rangeRound([0, this.width]);
    let y = d3.scaleLinear().rangeRound([height, 0]);
    let formatTime = d3.timeFormat("%e %B");

    //define the axis
    let yAxis = d3.axisLeft(y);
    let xAxis = d3.axisBottom(x).ticks(d3.timeMonth.every(2));
    //set the title of the graph
    svg.append("text")
      .attr("x", (this.width / 2))
      .attr("y", (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("text-decoration", "underline")
      .text('Speicherinhalt ' + this.damLabel);

    // set the definition of the drawing line for series
    let line = d3.line()
      .curve(d3.curveBasis)
      .x((d) => { return x(d.date) })
      .y((d) => { return y(d.value) });

    // add the tooltip element to the graph
    let div = d3.select("#reports").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // document.getElementById('htmlLegend').setAttribute('style','left:'+(this.width+margin.left+margin.right )+'px; bottom: '+(height-margin.bottom-20*(this.timespan.length))+'px;');
    // document.getElementById('htmlLegend'+(this.timespan.length-1)).firstElementChild.setAttribute('style', "stroke: black;color: red");
    // for(let i = 0; i<this.timespan.length;i++){
    //   if(this.timespan.length>4){
    //     document.getElementById('htmlLegend'+i)
    //     .setAttribute('style','left:'+(this.width+margin.left+margin.right )+'px; bottom: '+(height-margin.top-margin.bottom-25*(this.timespan.length-i-(this.timespan.length-4))-45)+'px; position: absolute');
    //   }else{
    //     document.getElementById('htmlLegend'+i)
    //     .setAttribute('style','left:'+(this.width+margin.left+margin.right )+'px; bottom: '+(height-margin.top-margin.bottom-25*(this.timespan.length-i)-45)+'px; position: absolute');
    //   }

    // }


    //collect and add timeseries of last two years from today back to the diagram
    this.datasetApi.getTsData(this.seriesId, this.serviceUrl, this.timespan[0], this.filter).subscribe((data) => {
      this.intervals = [];
      this.values = [];
      for (let i = 0; i < data.values.length; i++) {
        if (new Date(data.values[i]['timestamp']).getFullYear() === new Date(this.timespan[0].from).getFullYear()) {
          this.intervals.push(new Date(new Date().getFullYear() - 1, new Date(data.values[i]['timestamp']).getMonth(), new Date(data.values[i]['timestamp']).getDate()));
        }
        else if (new Date(data.values[i]['timestamp']).getFullYear() === new Date(this.timespan[0].to).getFullYear()
          && new Date(data.values[i]['timestamp']).getMonth() <= new Date(this.timespan[0].to).getMonth()) {
          this.intervals.push(new Date(new Date().getFullYear() + 1, new Date(data.values[i]['timestamp']).getMonth(), new Date(data.values[i]['timestamp']).getDate()));
        }
        else {
          this.intervals.push(new Date(new Date().getFullYear(), new Date(data.values[i]['timestamp']).getMonth(), new Date(data.values[i]['timestamp']).getDate()));
        }
        this.values.push(data.values[i]['value']);
      }
      let d3Data = [];
      for (let p = 0; p < this.intervals.length; p++)
        d3Data.push({ date: (this.intervals[p]), value: this.values[p] });



      // graphData.push(d3Data);

      if (this.compSeriesId == '') {
        x.domain(d3.extent(d3Data, function (d) { return d.date }));
        g.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1.5em")
          .attr("text-anchor", "middle")
          .text("Mio m³");
        redraw(d3Data);
      }
      // add x axis to the bottom of the graph
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + ', ' + xaxisHeight + ")")
        .call(xAxis);

      // gridlines in y axis function
      function make_y_gridlines() {
        return d3.axisLeft(y)
          .ticks(4)
      }
      // add the Y gridlines
      g.append("g")
        .attr("class", "grid")
        .attr('opacity', 0.5)
        .attr('stroke-width', 0.25)
        .call(make_y_gridlines()
          .tickSize(-this.width)
          .tickFormat("")
        );

      // add line for timeseries to graph
      let actualLine = g.append("path")
        .datum(d3Data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("id", "line")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("d", line);

      svg.append("text")
        .attr("x", this.width + margin.left + 25)
        .attr("y", height - margin.bottom - 25 * (this.timespan.length))
        .attr("class", "legend")
        .attr("id", "legend")
        .attr("cursor", "pointer")
        .style("font-size", "11px")
        .style("fill", "red")
        .style("padding", "5px")
        .on("click", function () {
          let active = actualLine.active ? false : true,
            newOpacity = active ? 0 : 1;
          let legendCol = active ? 'grey' : 'red';
          d3.select("#line").style("opacity", newOpacity);
          d3.select("#legend").style("fill", legendCol);
          actualLine.active = active;
        })
        .text('Inhalt: ' + new Date(this.timespan[0].from).getFullYear() + '-' + (new Date(this.timespan[0].to).getFullYear() - 1));

      svg.append('text')
        .attr("x", this.width + margin.left + 155)
        .attr("y", height - margin.bottom - 25 * (this.timespan.length)+5)
        .attr("fill", "red")
        .attr('font-size', 'xx-large')
        .text('-');



      this.loading = false;
    }, (err) => { this.errorOnLoading() });
    // }
    //collect and add timeseries of comparison years to the diagram
    if (this.compSeriesId != '') {
      for (let j = 1; j < this.timespan.length; j++) {
        this.datasetApi.getTsData(this.compSeriesId, this.serviceUrl, this.timespan[j], this.filter).subscribe((data) => {
          let compIntervals = [];
          let compValues = [];
          for (let i = 0; i < data.values.length; i++) {
            if (new Date(data.values[i]['timestamp']).getFullYear() === new Date(this.timespan[j].from).getFullYear()) {
              compIntervals.push(new Date(new Date().getFullYear() - 1, new Date(data.values[i]['timestamp']).getMonth(), new Date(data.values[i]['timestamp']).getDate()));
            }
            else if (new Date(data.values[i]['timestamp']).getFullYear() === new Date(this.timespan[j].to).getFullYear()
              && new Date(data.values[i]['timestamp']).getMonth() <= new Date(this.timespan[0].to).getMonth()) {
              compIntervals.push(new Date(new Date().getFullYear() + 1, new Date(data.values[i]['timestamp']).getMonth(), new Date(data.values[i]['timestamp']).getDate()));
            }
            else if (new Date(data.values[i]['timestamp']).getFullYear() === new Date(this.timespan[j].to).getFullYear()
              && new Date(data.values[i]['timestamp']).getMonth() > new Date(this.timespan[0].to).getMonth()) {
            }
            else {
              compIntervals.push(new Date(new Date().getFullYear(), new Date(data.values[i]['timestamp']).getMonth(), new Date(data.values[i]['timestamp']).getDate()));
            }
            compValues.push(data.values[i]['value']);
          }
          let datasets = [];
          for (let k = 0; k < compIntervals.length; k++)
            datasets.push({ date: (compIntervals[k]), value: compValues[k], year: new Date(this.timespan[j].from).getFullYear() + '/' + new Date(this.timespan[j].to).getFullYear() });

          x.domain(d3.extent(datasets, function (d) { return d.date }));
          graphData.push(datasets);

          if (this.compSeriesMax != 0) {
            if (this.compSeriesMax < d3.max(datasets, function (d) { return d.value; })) {
              this.compSeriesMax = d3.max(datasets, function (d) { return d.value; });
              redraw(datasets);
            }
          } else {
            this.compSeriesMax = d3.max(datasets, function (d) { return d.value; });
            y.domain([0, d3.max(datasets, function (d) { return d.value })]);
            // add y axis to the graph
            g.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("fill", "#000")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - margin.left)
              .attr("x", 0 - (height / 2))
              .attr("dy", "1.5em")
              .attr("text-anchor", "middle")
              .text("Mio m³");
          }


          // this.yAxisMax = Math.max(this.timeseriesMax, this.referenceMax, this.compSeriesMax);
          let color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";


          //add line to the graph
          let compLine = g.append("path")
            .datum(datasets)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-dasharray", ("10,3"))
            .attr("stroke-width", 1.5)
            .attr("id", 'line' + datasets[0].year.slice(5))
            .attr("d", line);

          /**
           *  dots and tooltip for scatterplot
           */
          let dots = g.selectAll("dot")
            .data(datasets)
            .enter().append("circle")
            .attr("opacity", 0.1)
            .attr("stroke", 'white')
            .attr("cursor", "pointer")
            .attr("fill", "white")
            .attr("id", 'dots' + datasets[0].year.slice(5))
            .attr("r", 1.5)
            .attr("cx", function (d) { return x(d.date); })
            .attr("cy", function (d) { return y(d.value); })
            .on("mouseover", function (d) {
              div.transition()
                .duration(200)
                .style("opacity", .9);
              div.html(formatTime(d.date) + "<span style='color:" + color + "; stroke=black;'><i class='fas fa-circle' style='padding: 5px;font-size: 80%;'> </i></span>"
                + "<br/>" + d.year + ": " + d.value)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("border", "0px")
                .style("border-radius", "8px")
                .style("background", "lightsteelblue")
                .style("text-align", "center");
            })
            .on("mouseout", function (d) {
              div.transition()
                .duration(500)
                .style("opacity", 0);
            });


          let legend = svg.append("text")
            .attr("x", this.width + margin.left + 25)
            .attr("y", height - margin.bottom - 25 * (j))
            .attr("class", "legend")
            .attr("font-size", "11px")
            .attr("id", "legend" + datasets[0].year.slice(5))
            .attr("cursor", "pointer")
            .style("fill", color)
            .style("padding", "5px")
            .on("click", function () {
              let active = compLine.active ? false : true,
                newOpacity = active ? 0 : 1;
              let dotOpacity = active ? 0 : 0.2;
              let legendCol = active ? 'grey' : color;
              d3.select("#line" + datasets[0].year.slice(5)).style("opacity", newOpacity);
              d3.select("#dots" + datasets[0].year.slice(5)).style("opacity", newOpacity);
              d3.select("#legend" + datasets[0].year.slice(5)).style("fill", legendCol);
              compLine.active = active;
            }).text('Vergleichsjahr: ' + datasets[0].year);

          svg.append('text')
            .attr("x", this.width + margin.left + 155)
            .attr("y", height - margin.bottom - 25 * (j)+5)
            .attr("fill", color)
            .attr('font-size', 'xx-large')
            .text('--');

          // document.getElementById('htmlLegend'+(j-1)).firstElementChild.setAttribute('style', "stroke: black;color: "+color);

        }, (err) => { this.errorOnLoading() })

      }
    }
    // // collect timeseries of rainfall at the reservoir 
    if (this.rainSeriesId != '')
      this.datasetApi.getTsData(this.rainSeriesId, this.serviceUrl, this.timespan[0], this.rainFilter).subscribe((res) => {
        let rainInterval = [];
        let rainValues = [];
        let secDataset = [];
        for (let k = 0; k < res.values.length; k++) {
          if (new Date(res.values[k]['timestamp']).getFullYear() === new Date(this.timespan[0].from).getFullYear()) {

            rainInterval.push(new Date(new Date().getFullYear() - 1, new Date(res.values[k]['timestamp']).getMonth(), new Date(res.values[k]['timestamp']).getDate()));
          }
          else if (new Date(res.values[k]['timestamp']).getFullYear() === new Date(this.timespan[0].to).getFullYear()) {
            rainInterval.push(new Date(new Date().getFullYear() + 1, new Date(res.values[k]['timestamp']).getMonth(), new Date(res.values[k]['timestamp']).getDate()));
          }
          else {
            rainInterval.push(new Date(new Date().getFullYear(), new Date(res.values[k]['timestamp']).getMonth(), new Date(res.values[k]['timestamp']).getDate()));
          }
          rainValues.push(res.values[k]['value']);

        }

        for (let p = 0; p < rainInterval.length; p++) {
          secDataset.push({ date: (rainInterval[p]), value: rainValues[p] });

        }


        //define new scale for y axis
        let yr = d3.scaleLinear().rangeRound([height, 0]);
        yr.domain([0, d3.max(secDataset, function (d) { return d.value; })]);

        //add y axis for rainseries
        g.append("g")
          .attr("transform", "translate(" + this.width + ',' + "0 )")
          .call(d3.axisRight(yr))
          .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 + margin.left)
          .attr("x", 0 - (height / 3))
          .attr("dy", "1.0em")
          .attr("text-anchor", "middle")
          .text("Tagessumme (mm)");
        //add bars
        g.selectAll("rect")
          .data(secDataset)
          .enter()
          .append("svg:rect")
          .style("fill", "steelblue")
          .attr('opacity', 0.5)
          .attr("x", function (d, i) { return x(d.date); })
          .attr("width", 1.5)
          .attr("y", function (d) { return yr(d.value); })
          .attr("height", function (d) { return height - yr(d.value); });


        console.log('Niederschlagssumme: ' + rainValues.reduce((sum, current) => sum + current));

      }, (error) => { this.errorOnLoading() });

    //collect and add referenceVaues for the selected reservoir to the diagram
    if (this.refValues != undefined) {
      for (let b = 0; b < this.refValues.length; b++) {
        this.datasetApi.getTsData(this.refValues[b].referenceId, this.serviceUrl, this.timespan[0]).subscribe((refVal) => {
          let refInterval = [];
          let currentRefValues = [];
          let refDataset = [];
          for (let k = 0; k < refVal.values.length; k++) {
            if (this.refValues[b].label === 'Vollstau') {
              refInterval.push(new Date(new Date().getFullYear() - 1, new Date(refVal.values[k]['timestamp']).getMonth(), new Date(refVal.values[k]['timestamp']).getDate()));
              refInterval.push(new Date(new Date().getFullYear(), new Date(refVal.values[k]['timestamp']).getMonth(), new Date(refVal.values[k]['timestamp']).getDate()));

              if (new Date(refVal.values[k]['timestamp']).getMonth() <= new Date().getMonth()) {
                refInterval.push(new Date(new Date().getFullYear() + 1, new Date(refVal.values[k]['timestamp']).getMonth(), new Date(refVal.values[k]['timestamp']).getDate()));
              }

              refInterval.push(new Date(new Date().getFullYear() + 1, 0, new Date().getDate()));
            }
            else {

              if (new Date(refVal.values[k]['timestamp']).getFullYear() === new Date(this.timespan[0].from).getFullYear()) {
                refInterval.push(new Date(new Date().getFullYear() - 1, new Date(refVal.values[k]['timestamp']).getMonth(), new Date(refVal.values[k]['timestamp']).getDate()));
              }
              else if (new Date(refVal.values[k]['timestamp']).getFullYear() === new Date(this.timespan[0].to).getFullYear()
                && new Date(refVal.values[k]['timestamp']).getMonth() <= new Date(this.timespan[0].to).getMonth()) {
                refInterval.push(new Date(new Date().getFullYear() + 1, new Date(refVal.values[k]['timestamp']).getMonth(), new Date(refVal.values[k]['timestamp']).getDate()));
              }
              else if (new Date(refVal.values[k]['timestamp']).getFullYear() === new Date(this.timespan[0].to).getFullYear()
                && new Date(refVal.values[k]['timestamp']).getMonth() > new Date(this.timespan[0].to).getMonth()) {
                // do nothing
              }
              else {
                refInterval.push(new Date(new Date().getFullYear(), new Date(refVal.values[k]['timestamp']).getMonth(), new Date(refVal.values[k]['timestamp']).getDate()));
              }
            }
            currentRefValues.push(refVal.values[k]['value']);
          }
          for (let p = 0; p < refInterval.length; p++) {
            refDataset.push({ date: refInterval[p], value: currentRefValues[p], label: this.refValues[b].label });
          }
          let refColor = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
          graphData.push(refDataset);
          // add line for referenceSeries
          redraw(refDataset)
          let refLine = g.append("path")
            .datum(refDataset)
            .attr("fill", "none")
            .attr("stroke", refColor)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("id", refDataset[0].label)
            .attr("d", line);



          svg.append("text")
            .attr("x", this.width + margin.left + 25)
            .attr("y", height - margin.bottom - 20 * b + 40)
            .attr("class", "legend")
            .attr("cursor", "pointer")
            .attr("id", "legend" + refDataset[0].label.slice(5))
            .style("font-size", "11px")
            .style("fill", refColor)
            .style("padding", "5px")
            .on("click", function () {
              let active = refLine.active ? false : true,
                newOpacity = active ? 0 : 1;
              let legendCol = active ? 'grey' : refColor;
              d3.select("#" + refDataset[0].label).style("opacity", newOpacity);
              d3.select("#legend" + refDataset[0].label.slice(5)).style("fill", legendCol);
              refLine.active = active;
            })
            .text(this.refValues[b].label);

            svg.append('text')
            .attr("x", this.width + margin.left + 155)
            .attr("y", height - margin.bottom - 20 * b+45)
            .attr("fill", refColor)
            .attr('font-size', 'xx-large')
            .text('-');

        }, (err) => {
          this.errorOnLoading();
        });
      }

    }
    else {
      this.loading = false;
    }
    // let rect = svg.append('rect')
    //   .attr('x', 10)
    //   .attr('y', (svgHeight - 200))
    //   .attr('fill', 'whitesmoke')
    //   .attr('width', 200)
    //   .attr('height', 150);

    // svg.append('text').attr('x', 20).attr('y', (svgHeight - 180)).text('Test');

    // svg.append('text')
    //   .attr("contenteditable", true)
    //   .attr('x', 20)
    //   .attr('y', (svgHeight - 160))
    //   .text(function(d){ return d.text;})
    //   .on("keyup", function(d) { d.text = d3.select(this).text(); });


    function redraw(data) {

      let yDomain = d3.scaleLinear().domain([0, d3.max(data, function (d) { return d.value })]);

      if (y.domain() < yDomain.domain()) {
        y.domain([0, d3.max(data, function (d) { return d.value })]);
        d3.select(".y").transition().call(yAxis);
      }

    }


  }
  public errorOnLoading() {
    this.loading = false;
  }

  /**
   * define which reservoir the report should be created for
   * @param label label of the reservoir
   * @param id number in list of possible reservoirs
   */
  public checkSelection(label: string, id: number) {


    if (this.diagram) {
      this.diagram = !this.diagram;
      this.compSeriesMax = 0;
      document.getElementById('reports').removeChild(document.getElementsByClassName("svg-container").item(0));
      // for(let i =0; i<this.timespan.length;i++)
      // document.getElementById('htmlLegend'+i).setAttribute('style', 'display: none');

    }
    this.diagram = !this.diagram;
    this.timespan[0].from = new Date(new Date().getFullYear(), new Date().getMonth()).getTime() - 31556926000;//63072000000;
    this.timespan[0].to = new Date(new Date().getFullYear(), 1).getTime() + 31556926000;
    this.timespan.splice(1);

    this.damLabel = label;
    this.seriesId = this.reservoirs[id].graph.seriesId;


    if (this.reservoirs[id].graph.compYearsFrom) {
      for (let y = 0; y < this.reservoirs[id].graph.compYearsFrom.length; y++) {
        this.timespan.push(new Timespan(new Date(this.reservoirs[id].graph.compYearsFrom[y], new Date(this.timespan[0].from).getMonth()).getTime(),
          new Date(this.reservoirs[id].graph.compYearsFrom[y] + 2, new Date(this.timespan[0].to).getMonth()).getTime()));
      }
    }
    if (this.reservoirs[id].graph.rainSeriesID) {
      this.rainSeriesId = this.reservoirs[id].graph.rainSeriesID;
    }
    else {
      this.rainSeriesId = '';
    }

    if (this.reservoirs[id].graph.referenceValues) {
      this.refValues = this.reservoirs[id].graph.referenceValues;
    } else {
      this.refValues = undefined;
    }

    if (this.reservoirs[id].graph.compSeriesId) {
      this.compSeriesId = this.reservoirs[id].graph.compSeriesId;
    } else {
      this.compSeriesId = '';
    }

    this.generateReport();
  }
  onSelection(id: number) {
    this.router.navigate(['reports', this.reservoirs[id].id]);
  }


  exportImage() {
    let svgString = new XMLSerializer().serializeToString(document.querySelector('svg'));
    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext("2d");
    let image = new Image();
    let svg = new Blob([svgString], { type: "image/svg+xml;base64;" });
    let url = window.URL.createObjectURL(svg);
    let svgBlob = new Blob([document.getElementById('reports').innerHTML], { type: "image/svg+xml;base64;" });
    // let svgUrl = window.URL.createObjectURL(svgBlob);

    image.onload = function () {
      ctx.drawImage(image, 0, 0);

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {

        window.navigator.msSaveOrOpenBlob(svgBlob, "report.png");
      } else {
        let png = canvas.toDataURL('image/png');
        let a = document.createElement("a");
        let downloadAttrSupport = typeof a.download !== "undefined";
        if (downloadAttrSupport) {
          a.download = "report.png";
          a.href = png;
          a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        }
        window.URL.revokeObjectURL(png);
      }

    };

    image.src = url;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }


}
