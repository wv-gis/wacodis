import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CsvDataService } from 'src/app/settings/csvData.service';
import * as d3 from 'd3';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
const itemsPerPage = 10;

export interface BwlDataset {
  LIMSAuftrag: string,
  Probe: string,
  Probenahme: string,
  coordY: string,
  coordX: string,
  entnahmeStelle: string,
  externeBez: string,
  Wert: string,
  uom: string,
}
const svgWidth = 1100, svgHeight = 850;
const margin = { top: 50, right: 20, bottom: 50, left: 40 };

@Component({
  selector: 'wv-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})

export class ProfileViewComponent implements OnInit, AfterViewInit {

  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: Event) {
    this.onResize();
  }

  @ViewChild('depthGraph')
  public d3Elem: ElementRef;

  @ViewChild('profileGraph')
  public profileElem: ElementRef;

  public headers: string[] = [];
  public entries = [];
  public entry;
  public responseText: string;
  public currentPage;
  public dataArr: string[];
  public bwlData: BwlDataset[] = [];
  public svg: any;
  public chart: any;
  public pchart: any;
  public profile: any;
  public profileSvg: any;

  constructor(protected csvService: CsvDataService) {
    // this.headers = csvService.getHeaders();
    // this.entries = csvService.getCsvDatasets();
    this.responseText = csvService.getCsvText();
  }

  ngOnInit() {
    let csvRecordsArray = this.responseText.split(/\r\n|\n/);

    //  let header = csvRecordsArray[0].split(';');
    let header = ['LIMSAuftrag', 'Probe', 'Probenahme', 'coordX', 'coordY', 'entnahmeStelle', 'externeBez', 'Wert', 'uom'];
    for (let j = 0; j < header.length; j++) {
      this.headers.push(header[j]);
    }
    for (let k = 1; k < csvRecordsArray.length; k++) {
      this.dataArr = csvRecordsArray[k].split(';'); // Zeilen
      let col = [];
      for (let i = 0; i < this.dataArr.length; i++) {
        col.push(this.dataArr[i]); //Spalten

        /**
         * 0 = LIMS Auftrag
         * 1 = Probe
         * 2 = Probenahmedatum
         * 3 = Probenahmezeit
         * 4 = Gauss Hoch
         * 5 = Gauss Rechts
         * 6 = Entnahmestelle
         * 7 = Externe Bezeichnung
         * 8 = Anzeigewert
         * 9 = Einheit
         */
      }
      this.currentPage = 1;
      this.entries.push(col);

    }
    this.entry = this.entries.slice(0, 10);
    //  console.log(this.entry);
    for (let p = 0; p < this.entry.length; p++) {
      this.bwlData.push({
        LIMSAuftrag: this.entry[p][0],
        Probe: this.entry[p][1],
        Probenahme: this.entry[p][2] + " " + this.entry[p][3],
        coordY: this.entry[p][4],
        coordX: this.entry[p][5],
        entnahmeStelle: this.entry[p][6],
        externeBez: this.entry[p][7],
        Wert: this.entry[p][8],
        uom: this.entry[p][9],
      });
    }
    // console.log(this.bwlData);


  }

  ngAfterViewInit(): void {
    // this.svg = d3.select("#d3Graph").append("div")
    //   .style('width', '100%')
    //   .style('height', '100%')
    //   .classed("svg-container", true)
    //   .append("svg")
    //   .attr('width', '100%')
    //   .attr('height', '100%');

    // this.chart = this.svg.append('g')
    //   .attr('transform', 'translate(' + margin.left + "," + margin.top + ")");

    this.profile = d3.select("#profileGraph").append("div")
      .style('width', '100%')
      .style('height', '100%')
      .classed("svg-container", true)
      
      this.profileSvg = this.profile.append("svg")
      .attr('width', svgWidth)
      .attr('height', svgHeight );

    this.pchart = this.profileSvg.append('g')
      .attr('transform', 'translate(' + margin.left + "," + margin.top + ")");

    this.createProfileViews();
  }


  public calculateWidth(): number {
    return this.svg.node().width.baseVal.value - margin.left - margin.right;
  }


  public calculateHeight(): number {
    return (this.d3Elem.nativeElement as HTMLElement).clientHeight - margin.top - margin.bottom;
  }


  protected onResize(): void {
    this.createProfileViews();
  }

  public createProfileViews() {



    // .classed("svg-content-responsive", true);
    // .attr('width', svgWidth).attr('height', svgHeight);
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", '0 0 ' + svgWidth + ' ' + svgHeight)
    // let width = this.calculateWidth();
    // let height = this.calculateHeight();

    let width = svgWidth -margin.left -margin.right;
    let height = svgHeight - margin.top - margin.bottom;
    if(width < 0){
      width = 1200;
    }
    // this.chart.selectAll('*').remove();
    this.pchart.selectAll('*').remove();
    // this.svg.selectAll('.axis').remove();
    this.profileSvg.selectAll('.axis').remove();
    this.profileSvg.selectAll('.legend').remove();
    let data = [{
      depth: 10,
      value: 8.1
    },
    {
      depth: 12,
      value: 7.92
    }, {
      depth: 14,
      value: 7.35
    }, {
      depth: 16,
      value: 7.04
    }, {
      depth: 18,
      value: 7.10
    }, {
      depth: 20,
      value: 7.10
    }, {
      depth: 22,
      value: 6.63
    }, {
      depth: 24,
      value: 6.23
    }, {
      depth: 26,
      value: 6.24
    }, {
      depth: 28,
      value: 6.13
    },
    {
      depth: 30,
      value: 5.93
    },
    ];


    let secData = [{
      depth: 10,
      value: 0.50
    },
    {
      depth: 12,
      value: 0.50
    }, {
      depth: 14,
      value: 0.50
    }, {
      depth: 16,
      value: 0.50
    }, {
      depth: 18,
      value: 0.50
    }, {
      depth: 20,
      value: 2.10
    }, {
      depth: 22,
      value: 2.10
    }, {
      depth: 24,
      value: 2.10
    }, {
      depth: 26,
      value: 2.10
    }, {
      depth: 28,
      value: 2.10
    }, {
      depth: 30,
      value: 2.20
    },
    ];

    let x = d3.scaleLinear().rangeRound([width, 0]);
    let y = d3.scaleLinear().rangeRound([0, height]);

    let line = d3.line()
      .x(function (d) { return x(d.value); })
      .y(function (d) { return y(d.depth); });


    let secLine = d3.line()
      .x(function (d) { return x(d.value); })
      .y(function (d) { return y(d.depth); });

    // let div = d3.select("#d3Graph").append("div")
    //   .attr("class", "tooltip")
    //   .style("opacity", 0);

    // y.domain(d3.extent(data, function (d) { return d.depth }));

    // let chart = this.svg.append('g').attr('transform', 'translate(' + margin.left + "," + margin.top + ")");

    // let d3Max = d3.max(data, function (d) { return d.value }) as number;
    // let d3MaxSec = d3.max(secData, function (d) { return d.value }) as number;

    // let max = Math.max(d3Max, d3MaxSec);

    // x.domain([max, 0]);
    // this.svg.append("g")
    //   .attr("class", "axis")
    //   .attr('font-size', '10px')
    //   .attr('stroke-width', 0.25)
    //   .attr("transform", "translate(" + margin.left + ',' + margin.top + ")")
    //   .call(d3.axisTop(x)).attr('font-size', '10px')

    // // gridlines in y axis function
    // function make_y_gridlines() {
    //   return d3.axisLeft(y)
    //     .ticks(4)
    // }
    // // add the Y gridlines
    // this.chart.append("g")
    //   .attr("class", "grid")
    //   .attr('opacity', 0.5)
    //   .attr('stroke-width', 0.25)
    //   .call(make_y_gridlines()
    //     .tickSize(-width)
    //     .tickFormat("")
    //   );

    // // gridlines in y axis function
    // function make_x_gridlines() {
    //   return d3.axisLeft(x)
    //     .ticks(1)
    // }
    // // add the Y gridlines
    // this.chart.append("g")
    //   .attr("class", "xgrid")
    //   .attr('opacity', 0.5)
    //   .attr('stroke-width', 0.25)
    //   .attr("transform", "translate(" + width + ',' + 0 + ")")
    //   .call(make_x_gridlines()
    //     .tickSize(height)
    //     .tickFormat("")
    //   );

    // this.chart.append('path')
    //   .datum(data)
    //   .attr("fill", "none")
    //   .attr("stroke", "red")
    //   .attr("stroke-linejoin", "round")
    //   .attr("stroke-linecap", "round")
    //   .attr("stroke-width", 0.5)
    //   .attr('d', line);

    // this.chart.append('path')
    //   .datum(secData)
    //   .attr("fill", "none")
    //   .attr("stroke", "blue")
    //   .attr("stroke-linejoin", "round")
    //   .attr("stroke-linecap", "round")
    //   .attr("stroke-width", 0.5)
    //   .attr('d', secLine);

    // this.chart.append("g")
    //   .call(d3.axisLeft(y)).attr('font-size', '10px').attr('stroke-width', 0.25)
    //   .append("text")
    //   .attr("fill", "#000")
    //   .attr('font-size', '10px')
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 0 - margin.left)
    //   .attr("x", 0 - (height / 2))
    //   .attr("dy", "1.71em")
    //   .attr("text-anchor", "middle")
    //   .text("Tiefe [m]");

    // let dots = this.chart.selectAll("dot")
    //   .data(secData)
    //   .enter().append("circle")
    //   .attr("opacity", 0.5)
    //   .attr("stroke", 'blue')
    //   .attr("cursor", "pointer")
    //   .attr("fill", "blue")
    //   .attr("id", 'dots')
    //   .attr("r", 1.0)
    //   .attr("cx", function (d) { return x(d.value); })
    //   .attr("cy", function (d) { return y(d.depth); })
    //   .on("mouseover", function (d) {
    //     div.transition()
    //       .duration(200)
    //       .style("opacity", .9);
    //     div.html('Chlorophyll: ' + d.value + ' [µg/l]')
    //       .style("left", (d3.event.pageX) + "px")
    //       .style("top", (d3.event.pageY - 28) + "px")
    //       .style("border", "0px")
    //       .style("border-radius", "8px")
    //       .style("background", "lightsteelblue")
    //       .style("text-align", "center");
    //   })
    //   .on("mouseout", function (d) {
    //     div.transition()
    //       .duration(500)
    //       .style("opacity", 0);
    //   });

    // let secdots = this.chart.selectAll("dot")
    //   .data(data)
    //   .enter().append("circle")
    //   .attr("opacity", 0.5)
    //   .attr("stroke", 'red')
    //   .attr("cursor", "pointer")
    //   .attr("fill", "red")
    //   .attr("id", 'dots')
    //   .attr("r", 1.0)
    //   .attr("cx", function (d) { return x(d.value); })
    //   .attr("cy", function (d) { return y(d.depth); })
    //   .on("mouseover", function (d) {
    //     div.transition()
    //       .duration(200)
    //       .style("opacity", .9);
    //     div.html('Temperatur: ' + d.value + ' [C°]')
    //       .style("left", (d3.event.pageX) + "px")
    //       .style("top", (d3.event.pageY - 28) + "px")
    //       .style("border", "0px")
    //       .style("border-radius", "8px")
    //       .style("background", "lightsteelblue")
    //       .style("text-align", "center");
    //   })
    //   .on("mouseout", function (d) {
    //     div.transition()
    //       .duration(500)
    //       .style("opacity", 0);
    //   });


    // let xr = d3.scaleLinear().rangeRound([0, width]);
    // let yr = d3.scaleLinear().rangeRound([height,0]);
    // // xr.domain([0, secData.length]);
    // yr.domain([0, d3.max(secData, function (d) { return d.value; })]);
    // chart.append("g")
    //   .attr("transform", "translate(" + width + ',' +  "0 )")
    //   .call(d3.axisRight(yr))
    //   .append("text")
    //   .attr("fill", "#000")
    //   .attr("transform", "rotate(-360)")
    //   .attr("y", 6)
    //   .attr("dy", "0.71em")
    //   .attr("text-anchor", "end")
    //   .text("rain (mm)");
    // chart.selectAll("rect")
    //   .data(secData)
    //   .enter()
    //   .append("svg:rect")
    //   .style("fill", "steelblue")
    //   .attr("x", function (d, i) { return x(d.date); })
    //   .attr("width", 2)
    //   .attr("y", function (d) { return  yr(d.value); })
    //   .attr("height", function (d) { return height-yr(d.value); });
    // console.log(new Date(2019,0,1));


    // let profile = d3.select("#profileGraph").append("div")
    //   .classed("svg-container", true)
    //   .append("svg")
    //   .attr("preserveAspectRatio", "xMinYMin meet")
    //   .attr("viewBox", '0 0 ' + svgWidth + ' ' + svgHeight)
    //   .attr('width', svgWidth)
    //   .attr('height', svgHeight)
    //   .classed("svg-content-responsive", true);
    // .attr('width', svgWidth).attr('height', svgHeight);

    let profData = [{
      date: new Date(2019, 1, 10),
      depth: 10,
      value: 12.1,
      color: 'lightblue'
    },
    {
      date: new Date(2019, 1, 10),
      depth: 12,
      value: 10.92,
      color: 'lightblue'
    }, {
      date: new Date(2019, 1, 10),
      depth: 14,
      value: 8.35,
      color: 'lightblue'
    }, {
      date: new Date(2019, 1, 10),
      depth: 16,
      value: 7.04,
      color: 'lightblue'
    }, {
      date: new Date(2019, 1, 10),
      depth: 18,
      value: 6.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 1, 10),
      depth: 20,
      value: 5.90,
      color: 'lightblue'
    }, {
      date: new Date(2019, 1, 10),
      depth: 22,
      value: 4.63,
      color: 'lightblue'
    }, {
      date: new Date(2019, 1, 10),
      depth: 24,
      value: 3.23,
      color: 'orange'
    }, {
      date: new Date(2019, 1, 10),
      depth: 26,
      value: 3.24,
      color: 'orange'
    }, {
      date: new Date(2019, 1, 10),
      depth: 28,
      value: 3.13,
      color: 'orange'
    },
    {
      date: new Date(2019, 1, 10),
      depth: 30,
      value: 3.93,
      color: 'orange'
    }, {
      date: new Date(2019, 1, 24),
      depth: 10,
      value: 14.1,
      color: 'lightblue'
    },
    {
      date: new Date(2019, 1, 24),
      depth: 12,
      value: 13.92,
      color: 'lightblue'
    }, {
      date: new Date(2019, 1, 24),
      depth: 14,
      value: 12.35,
      color: 'lightblue'
    }, {
      date: new Date(2019, 1, 24),
      depth: 16,
      value: 12.04,
      color: 'lightblue'
    }, {
      date: new Date(2019, 1, 24),
      depth: 18,
      value: 11.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 1, 24),
      depth: 20,
      value: 10.50,
      color: 'lightblue'
    }, {
      date: new Date(2019, 1, 24),
      depth: 22,
      value: 10.63,
      color: 'lightblue'
    }, {
      date: new Date(2019, 1, 24),
      depth: 24,
      value: 9.23,
      color: 'orange'
    }, {
      date: new Date(2019, 1, 24),
      depth: 26,
      value: 8.24,
      color: 'orange'
    }, {
      date: new Date(2019, 1, 24),
      depth: 28,
      value: 7.13,
      color: 'orange'
    },
    {
      date: new Date(2019, 1, 24),
      depth: 30,
      value: 5.93,
      color: 'orange'
    },
    {
      date: new Date(2019, 2, 10),
      depth: 10,
      value: 13.1,
      color: 'lightblue'
    },
    {
      date: new Date(2019, 2, 10),
      depth: 12,
      value: 11.92,
      color: 'lightblue'
    }, {
      date: new Date(2019, 2, 10),
      depth: 14,
      value: 10.35,
      color: 'orange'
    }, {
      date: new Date(2019, 2, 10),
      depth: 16,
      value: 10.04,
      color: 'orange'
    }, {
      date: new Date(2019, 2, 10),
      depth: 18,
      value: 7.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 2, 10),
      depth: 20,
      value: 8.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 2, 10),
      depth: 22,
      value: 6.63,
      color: 'orange'
    }, {
      date: new Date(2019, 2, 10),
      depth: 24,
      value: 5.03,
      color: 'orange'
    }, {
      date: new Date(2019, 2, 10),
      depth: 26,
      value: 5.04,
      color: 'orange'
    }, {
      date: new Date(2019, 2, 10),
      depth: 28,
      value: 5.73,
      color: 'orange'
    },
    {
      date: new Date(2019, 2, 10),
      depth: 30,
      value: 4.93,
      color: 'orange'
    },
    {
      date: new Date(2019, 2, 24),
      depth: 10,
      value: 12.1,
      color: 'green'
    },
    {
      date: new Date(2019, 2, 24),
      depth: 12,
      value: 10.92,
      color: 'green'
    }, {
      date: new Date(2019, 2, 24),
      depth: 14,
      value: 10.35,
      color: 'lightblue'
    }, {
      date: new Date(2019, 2, 24),
      depth: 16,
      value: 6.04,
      color: 'orange'
    }, {
      date: new Date(2019, 2, 24),
      depth: 18,
      value: 9.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 2, 24),
      depth: 20,
      value: 9.80,
      color: 'lightblue'
    }, {
      date: new Date(2019, 2, 24),
      depth: 22,
      value: 8.63,
      color: 'lightblue'
    }, {
      date: new Date(2019, 2, 24),
      depth: 24,
      value: 7.93,
      color: 'orange'
    }, {
      date: new Date(2019, 2, 24),
      depth: 26,
      value: 6.54,
      color: 'lightblue'
    }, {
      date: new Date(2019, 2, 24),
      depth: 28,
      value: 6.73,
      color: 'lightblue'
    },
    {
      date: new Date(2019, 2, 24),
      depth: 30,
      value: 5.23,
      color: 'orange'
    },
    {
      date: new Date(2019, 3, 10),
      depth: 10,
      value: 12.1,
      color: 'lightblue'
    },
    {
      date: new Date(2019, 3, 10),
      depth: 12,
      value: 10.92,
      color: 'lightblue'
    }, {
      date: new Date(2019, 3, 10),
      depth: 14,
      value: 8.35,
      color: 'lightblue'
    }, {
      date: new Date(2019, 3, 10),
      depth: 16,
      value: 7.04,
      color: 'lightblue'
    }, {
      date: new Date(2019, 3, 10),
      depth: 18,
      value: 6.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 3, 10),
      depth: 20,
      value: 5.90,
      color: 'lightblue'
    }, {
      date: new Date(2019, 3, 10),
      depth: 22,
      value: 4.63,
      color: 'lightblue'
    }, {
      date: new Date(2019, 3, 10),
      depth: 24,
      value: 3.23,
      color: 'orange'
    }, {
      date: new Date(2019, 3, 10),
      depth: 26,
      value: 3.24,
      color: 'orange'
    }, {
      date: new Date(2019, 3, 10),
      depth: 28,
      value: 3.13,
      color: 'orange'
    },
    {
      date: new Date(2019, 3, 10),
      depth: 30,
      value: 3.93,
      color: 'orange'
    }, {
      date: new Date(2019, 3, 24),
      depth: 10,
      value: 14.1,
      color: 'lightblue'
    },
    {
      date: new Date(2019, 3, 24),
      depth: 12,
      value: 13.92,
      color: 'lightblue'
    }, {
      date: new Date(2019, 3, 24),
      depth: 14,
      value: 12.35,
      color: 'lightblue'
    }, {
      date: new Date(2019, 3, 24),
      depth: 16,
      value: 12.04,
      color: 'lightblue'
    }, {
      date: new Date(2019, 3, 24),
      depth: 18,
      value: 11.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 3, 24),
      depth: 20,
      value: 10.50,
      color: 'lightblue'
    }, {
      date: new Date(2019, 3, 24),
      depth: 22,
      value: 10.63,
      color: 'lightblue'
    }, {
      date: new Date(2019, 3, 24),
      depth: 24,
      value: 9.23,
      color: 'orange'
    }, {
      date: new Date(2019, 3, 24),
      depth: 26,
      value: 8.24,
      color: 'orange'
    }, {
      date: new Date(2019, 3, 24),
      depth: 28,
      value: 7.13,
      color: 'orange'
    },
    {
      date: new Date(2019, 3, 24),
      depth: 30,
      value: 5.93,
      color: 'orange'
    },
    {
      date: new Date(2019, 4, 10),
      depth: 10,
      value: 13.1,
      color: 'lightblue'
    },
    {
      date: new Date(2019, 4, 10),
      depth: 12,
      value: 11.92,
      color: 'lightblue'
    }, {
      date: new Date(2019, 4, 10),
      depth: 14,
      value: 10.35,
      color: 'orange'
    }, {
      date: new Date(2019, 4, 10),
      depth: 16,
      value: 10.04,
      color: 'orange'
    }, {
      date: new Date(2019, 4, 10),
      depth: 18,
      value: 7.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 4, 10),
      depth: 20,
      value: 8.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 4, 10),
      depth: 22,
      value: 6.63,
      color: 'orange'
    }, {
      date: new Date(2019, 4, 10),
      depth: 24,
      value: 5.03,
      color: 'orange'
    }, {
      date: new Date(2019, 4, 10),
      depth: 26,
      value: 5.04,
      color: 'orange'
    }, {
      date: new Date(2019, 4, 10),
      depth: 28,
      value: 5.73,
      color: 'orange'
    },
    {
      date: new Date(2019, 4, 10),
      depth: 30,
      value: 4.93,
      color: 'orange'
    },
    {
      date: new Date(2019, 4, 24),
      depth: 10,
      value: 12.1,
      color: 'green'
    },
    {
      date: new Date(2019, 4, 24),
      depth: 12,
      value: 10.92,
      color: 'green'
    }, {
      date: new Date(2019, 4, 24),
      depth: 14,
      value: 10.35,
      color: 'lightblue'
    }, {
      date: new Date(2019, 4, 24),
      depth: 16,
      value: 6.04,
      color: 'orange'
    }, {
      date: new Date(2019, 4, 24),
      depth: 18,
      value: 9.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 4, 24),
      depth: 20,
      value: 9.80,
      color: 'lightblue'
    }, {
      date: new Date(2019, 4, 24),
      depth: 22,
      value: 8.63,
      color: 'lightblue'
    }, {
      date: new Date(2019, 4, 24),
      depth: 24,
      value: 7.93,
      color: 'orange'
    }, {
      date: new Date(2019, 4, 24),
      depth: 26,
      value: 6.54,
      color: 'lightblue'
    }, {
      date: new Date(2019, 4, 24),
      depth: 28,
      value: 6.73,
      color: 'lightblue'
    },
    {
      date: new Date(2019, 4, 24),
      depth: 30,
      value: 5.23,
      color: 'orange'
    },
    {
      date: new Date(2019, 5, 10),
      depth: 10,
      value: 12.1,
      color: 'lightblue'
    },
    {
      date: new Date(2019, 5, 10),
      depth: 12,
      value: 10.92,
      color: 'lightblue'
    }, {
      date: new Date(2019, 5, 10),
      depth: 14,
      value: 8.35,
      color: 'lightblue'
    }, {
      date: new Date(2019, 5, 10),
      depth: 16,
      value: 7.04,
      color: 'lightblue'
    }, {
      date: new Date(2019, 5, 10),
      depth: 18,
      value: 6.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 5, 10),
      depth: 20,
      value: 5.90,
      color: 'lightblue'
    }, {
      date: new Date(2019, 5, 10),
      depth: 22,
      value: 4.63,
      color: 'lightblue'
    }, {
      date: new Date(2019, 5, 10),
      depth: 24,
      value: 3.23,
      color: 'orange'
    }, {
      date: new Date(2019, 5, 10),
      depth: 26,
      value: 3.24,
      color: 'orange'
    }, {
      date: new Date(2019, 5, 10),
      depth: 28,
      value: 3.13,
      color: 'orange'
    },
    {
      date: new Date(2019, 5, 10),
      depth: 30,
      value: 3.93,
      color: 'orange'
    }, {
      date: new Date(2019, 5, 24),
      depth: 10,
      value: 14.1,
      color: 'lightblue'
    },
    {
      date: new Date(2019, 5, 24),
      depth: 12,
      value: 13.92,
      color: 'lightblue'
    }, {
      date: new Date(2019, 5, 24),
      depth: 14,
      value: 12.35,
      color: 'lightblue'
    }, {
      date: new Date(2019, 5, 24),
      depth: 16,
      value: 12.04,
      color: 'lightblue'
    }, {
      date: new Date(2019, 5, 24),
      depth: 18,
      value: 11.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 5, 24),
      depth: 20,
      value: 10.50,
      color: 'lightblue'
    }, {
      date: new Date(2019, 5, 24),
      depth: 22,
      value: 10.63,
      color: 'lightblue'
    }, {
      date: new Date(2019, 5, 24),
      depth: 24,
      value: 9.23,
      color: 'orange'
    }, {
      date: new Date(2019, 5, 24),
      depth: 26,
      value: 8.24,
      color: 'orange'
    }, {
      date: new Date(2019, 5, 24),
      depth: 28,
      value: 7.13,
      color: 'orange'
    },
    {
      date: new Date(2019, 5, 24),
      depth: 30,
      value: 5.93,
      color: 'orange'
    },
    {
      date: new Date(2019, 6, 10),
      depth: 10,
      value: 13.1,
      color: 'lightblue'
    },
    {
      date: new Date(2019, 6, 10),
      depth: 12,
      value: 11.92,
      color: 'lightblue'
    }, {
      date: new Date(2019, 6, 10),
      depth: 14,
      value: 10.35,
      color: 'orange'
    }, {
      date: new Date(2019, 6, 10),
      depth: 16,
      value: 10.04,
      color: 'orange'
    }, {
      date: new Date(2019, 6, 10),
      depth: 18,
      value: 7.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 6, 10),
      depth: 20,
      value: 8.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 6, 10),
      depth: 22,
      value: 6.63,
      color: 'orange'
    }, {
      date: new Date(2019, 6, 10),
      depth: 24,
      value: 5.03,
      color: 'orange'
    }, {
      date: new Date(2019, 6, 10),
      depth: 26,
      value: 5.04,
      color: 'orange'
    }, {
      date: new Date(2019, 6, 10),
      depth: 28,
      value: 5.73,
      color: 'orange'
    },
    {
      date: new Date(2019, 6, 10),
      depth: 30,
      value: 4.93,
      color: 'orange'
    },
    {
      date: new Date(2019, 6, 24),
      depth: 10,
      value: 12.1,
      color: 'green'
    },
    {
      date: new Date(2019, 6, 24),
      depth: 12,
      value: 10.92,
      color: 'green'
    }, {
      date: new Date(2019, 6, 24),
      depth: 14,
      value: 10.35,
      color: 'lightblue'
    }, {
      date: new Date(2019, 6, 24),
      depth: 16,
      value: 6.04,
      color: 'orange'
    }, {
      date: new Date(2019, 6, 24),
      depth: 18,
      value: 9.10,
      color: 'lightblue'
    }, {
      date: new Date(2019, 6, 24),
      depth: 20,
      value: 9.80,
      color: 'lightblue'
    }, {
      date: new Date(2019, 6, 24),
      depth: 22,
      value: 8.63,
      color: 'lightblue'
    }, {
      date: new Date(2019, 6, 24),
      depth: 24,
      value: 7.93,
      color: 'orange'
    }, {
      date: new Date(2019, 6, 24),
      depth: 26,
      value: 6.54,
      color: 'lightblue'
    }, {
      date: new Date(2019, 6, 24),
      depth: 28,
      value: 6.73,
      color: 'lightblue'
    },
    {
      date: new Date(2019, 6, 24),
      depth: 30,
      value: 5.23,
      color: 'orange'
    },
    ];


    let colorNum = 14;
    // let pchart = this.profile.append('g').attr('transform', 'translate(' + margin.left + "," + margin.top + ")");
    // let colors = ['#ebeffd','#c7d4fa','#91abf5','#5b82f0','#2559eb','#103bb1'];
    let colors = [
      '#fdfdff',
      '#ebeffd',
      '#d9e2fb',
      '#c7d4fa',
      '#b5c6f8',
      '#a3b9f7',
      '#91abf5',
      '#7f9df3',
      '#6d90f2',
      '#5b82f0',
      '#4974ee',
      '#3767ed',
      '#2559eb'
    ];
    let format = d3.timeFormat("%Y%m%d");

    let gridSize = Math.floor(width / 13);
    console.log(gridSize);
    let px = d3.scaleTime().range([0, (width -margin.left - margin.right) ]);
    let py = d3.scaleLinear().rangeRound([0, height -margin.top - margin.bottom  ]);

    let cards = this.profileSvg.selectAll(".prof").data(profData);
    let colorScale = d3.scaleQuantile()
      .domain([0, colorNum - 1, d3.max(profData, function (d) { return d; })])
      .range(colors);

    py.domain(d3.extent(profData, function (d) { return d.depth; }));
    // px.domain(d3.extent(profData, function (d) { return (d.date.getTime()); }));
    px.domain([d3.min(profData, function(d){return d.date.getTime()-2628000000;}),d3.max(profData, function(d){return d.date.getTime()+ 2628000000;})])


    this.profileSvg.append("g")
      .attr("class", "axis")
      .attr('font-size', '10px')
      .attr('stroke-width', 0.25)
      .attr("transform", "translate(" + margin.left + ',' + margin.top + ")")
      .call(d3.axisTop(px)).attr('font-size', '10px')

    this.pchart.append("g")
      .call(d3.axisLeft(py)).attr('font-size', '10px').attr('stroke-width', 0.25)
      .append("text")
      .attr("fill", "#000")
      .attr('font-size', '10px')
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2)-gridSize)
      .attr("dy", "1.71em")
      .attr("text-anchor", "middle")
      .text("Tiefe [m]");

    cards.enter().append("rect")
      .attr("x", function (d) { return px((d.date.getTime())); })
      .attr("y", function (d) { return py(d.depth)  ; })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", "prof bordered")
      .attr("width", gridSize)
      .attr("height", gridSize)
      .attr("transform", "translate("+ margin.left + ","+ margin.top +")")
      .style("fill", function (d) { return colorScale(d.value); });

      for(let i=0; i< profData.length; i ++){
        console.log(profData[i].date.getTime());
        console.log('Date: ' + profData[i].date);
        console.log('Scale: ' + px(profData[i].date));
      }

      cards.enter().append("text")
      .text(function (d) { return d.value;})
      .attr("x", function (d) { return px((d.date)) + margin.left; })
      .attr("y", function (d) { return py(d.depth) + margin.top + 15; });

      let legend = this.profileSvg.selectAll(".legend")
      .data([0].concat(colorScale.quantiles()), function (d) { return d.value; }).enter().append("g")
      .attr("class", "legend");

    legend.append("rect")
      .attr("x", function (d, i) { return gridSize * i + margin.left; })
      .attr("y", height + margin.top)
      .attr("width", gridSize  )
      .attr("height", gridSize / 3)
      .style("fill", function (d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function (d) { return "≥" + Math.round(d); })
      .attr("x", function (d, i) { return gridSize  * i + margin.left; })
      .attr("y", height  + margin.top);

      legend.exit().remove();
  }

  /**
   * not suitable for date and value fields as strings
   * @param n row which should invoke the sorting sequence
   */
  private sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("bwlTable");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }
}
