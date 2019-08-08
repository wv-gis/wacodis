import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { CsvDataService } from 'src/app/settings/csvData.service';
import * as d3 from 'd3';
import Plotly from 'plotly.js-dist';
import { interpolate } from '@angular/core/src/view/util';

const itemsPerPage = 10;
const colorRgb = [
  'rgb(230,25,75)',
  'rgb(245,130,49)',
  'rgb(250,175,12)',
  'rgb(255,255,0)',
  'rgb(188,246,12)',
  'rgb(109,204,69)',
  'rgb(0,255,0)',
  'rgb(53,112,28)',
  'rgb(16,97,79)',
  'rgb(0,255,216)',
  'rgb(51,102,255)',
  'rgb(37,89,235)',
  'rgb(0,51,255)',
];
const svgWidth = 1100, svgHeight = 850;
const margin = { top: 50, right: 20, bottom: 50, left: 40 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;


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

export interface InterDataset {
  date: Date,
  depth: number,
  value: number,

}


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
  public dataset: InterDataset[] = [];
  public responseInterp: string;
  public InterArr: string[];
  public oxyEntries = [];
  public maxDepth: number[] = [];
  public measureDates: Date[] = [];
  public plot;
  public fixed: boolean = true;
  public even: boolean = false;



  //input parameters:
  private num_iso = 15;
  private size_iso = 1; // Abstand zwischen Isolinien
  private start_iso = 1;
  private end_iso = 15;
  public selectMeasureParam: string = 'Sauerstoff [mg/l]';
  private dam_label = 'Dhünn-Talsperre BojeA'
  private reversedColor = false;
  private year = 2004//new Date().getFullYear() - 1;
  public measureParams = ['Sauerstoff [mg/l]', "Temperatur C°", "ph-Wert", "Chlorophyll [yg/l]", "Leitfähigkeit [yS/cm]", "Trübung [TEF]"];
  public defaultDate: Date = new Date(new Date().getFullYear() - 1, 0, 1);
  public selDate: Date[] = [new Date(this.year, 0, 1), new Date(this.year, 1, 1), new Date(this.year, 2, 1), new Date(this.year, 3, 1),
  new Date(this.year, 4, 1), new Date(this.year, 5, 1), new Date(this.year, 6, 1), new Date(this.year, 7, 1),
  new Date(this.year, 8, 1), new Date(this.year, 9, 1), new Date(this.year, 10, 1), new Date(this.year, 11, 1)];
  public autocontourPara = false;

  constructor(protected csvService: CsvDataService) {
    this.responseText = csvService.getCsvText();
    this.responseInterp = csvService.getInterpText();
  }

  ngOnInit() {
    let csvRecordsArray = this.responseText.split(/\r\n|\n/);
    let csvInterArray = this.responseInterp.split(/\r\n|\n/);

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

    for (let k = 1; k < csvInterArray.length; k++) {
      this.InterArr = csvInterArray[k].split(';'); // Zeilen
      let col = [];
      for (let i = 0; i < this.InterArr.length; i++) {
        col.push(this.InterArr[i]); //Spalten
        /**
          * 0 = Datum
          * 1 = Tiefe
          * 2 = Werte
          * 3 = Werte
          * 4 = ...
          */
      }
      this.oxyEntries.push(col);

    }
    for (let p = 0; p < this.oxyEntries.length; p++) {

      this.dataset.push({
        date: new Date(this.oxyEntries[p][0].split('.')[2], this.oxyEntries[p][0].split('.')[1] - 1, this.oxyEntries[p][0].split('.')[0]),
        depth: this.oxyEntries[p][1],
        value: this.oxyEntries[p][2],
      });
      if (p > 0 && new Date(this.oxyEntries[p][0].split('.')[2], this.oxyEntries[p][0].split('.')[1] - 1, this.oxyEntries[p][0].split('.')[0]).getTime() >
        new Date(this.oxyEntries[p - 1][0].split('.')[2], this.oxyEntries[p - 1][0].split('.')[1] - 1, this.oxyEntries[p - 1][0].split('.')[0]).getTime()) {
        this.maxDepth.push(this.oxyEntries[p - 1][1]);
        this.measureDates.push(new Date(this.oxyEntries[p - 1][0].split('.')[2], this.oxyEntries[p - 1][0].split('.')[1] - 1, this.oxyEntries[p - 1][0].split('.')[0]));
      }
    }
    let length = this.oxyEntries.length - 1;
    this.maxDepth.push(this.oxyEntries[length][1]);
    this.measureDates.push(new Date(this.oxyEntries[length][0].split('.')[2], this.oxyEntries[length][0].split('.')[1] - 1, this.oxyEntries[length][0].split('.')[0]));
  }

  ngAfterViewInit(): void {
    this.svg = d3.select("#d3Graph").append("div")
      .style('width', '100%')
      .style('height', '100%')
      .classed("svg-container", true)
      .append("svg")
      .attr('width', '100%')
      .attr('height', '100%');

    this.chart = this.svg.append('g')
      .attr('transform', 'translate(' + margin.left + "," + margin.top + ")");


    document.forms.item(0).addEventListener("click", listener => {

      if (document.forms.item(0).elements["iso"].value == "fixed") {


        this.fixed = this.fixed;
        this.even = !this.fixed
        document.getElementById("numIso").setAttribute("disabled", "disabled");
        document.getElementById("distIso").removeAttribute("disabled");
        this.autocontourPara = !this.autocontourPara;

      }
      else {
        this.even = this.even;
        this.fixed = !this.even;
        document.getElementById("numIso").removeAttribute('disabled');
        document.getElementById("distIso").setAttribute("disabled", "disabled");
        this.autocontourPara = !this.autocontourPara;

      }
    });

    this.createDepthView();
  }
  public changeMeasureParam(param: string) {
    this.selectMeasureParam = param;
  }
  public changeFromDate(fromDate: Date) {
    this.defaultDate = fromDate;
  }

  public calculateWidth(): number {
    return this.svg.node().width.baseVal.value - margin.left - margin.right;
  }

  public calculateHeight(): number {
    return (this.d3Elem.nativeElement as HTMLElement).clientHeight - margin.top - margin.bottom;
  }
  protected onResize(): void {
    this.createDepthView();
  }
  public createDepthView() {

    let reWidth = this.calculateWidth();
    let reHeight = this.calculateHeight();
    if (reWidth < 0) {
      reWidth = width;
    }
    this.chart.selectAll('*').remove();
    // this.pchart.selectAll('*').remove();
    this.svg.selectAll('.axis').remove();
    // this.profileSvg.selectAll('.axis').remove();
    // this.profileSvg.selectAll('.legend').remove();
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

    let x = d3.scaleLinear().rangeRound([reWidth, 0]);
    let y = d3.scaleLinear().rangeRound([0, reHeight]);

    let line = d3.line()
      .x(function (d) { return x(d.value); })
      .y(function (d) { return y(d.depth); });


    let secLine = d3.line()
      .x(function (d) { return x(d.value); })
      .y(function (d) { return y(d.depth); });

    let div = d3.select("#d3Graph").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    y.domain(d3.extent(data, function (d) { return d.depth }));

    let chart = this.svg.append('g').attr('transform', 'translate(' + margin.left + "," + margin.top + ")");

    let d3Max = d3.max(data, function (d) { return d.value }) as number;
    let d3MaxSec = d3.max(secData, function (d) { return d.value }) as number;

    let max = Math.max(d3Max, d3MaxSec);

    x.domain([max, 0]);
    this.svg.append("g")
      .attr("class", "axis")
      .attr('font-size', '10px')
      .attr('stroke-width', 0.25)
      .attr("transform", "translate(" + margin.left + ',' + margin.top + ")")
      .call(d3.axisTop(x)).attr('font-size', '10px')

    // gridlines in y axis function
    function make_y_gridlines() {
      return d3.axisLeft(y)
        .ticks(4)
    }
    // add the Y gridlines
    this.chart.append("g")
      .attr("class", "grid")
      .attr('opacity', 0.5)
      .attr('stroke-width', 0.25)
      .call(make_y_gridlines()
        .tickSize(-reWidth)
        .tickFormat("")
      );

    // gridlines in y axis function
    function make_x_gridlines() {
      return d3.axisLeft(x)
        .ticks(1)
    }
    // add the Y gridlines
    this.chart.append("g")
      .attr("class", "xgrid")
      .attr('opacity', 0.5)
      .attr('stroke-width', 0.25)
      .attr("transform", "translate(" + reWidth + ',' + 0 + ")")
      .call(make_x_gridlines()
        .tickSize(reHeight)
        .tickFormat("")
      );

    this.chart.append('path')
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 0.5)
      .attr('d', line);

    this.chart.append('path')
      .datum(secData)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 0.5)
      .attr('d', secLine);

    this.chart.append("g")
      .call(d3.axisLeft(y)).attr('font-size', '10px').attr('stroke-width', 0.25)
      .append("text")
      .attr("fill", "#000")
      .attr('font-size', '10px')
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (reHeight / 2))
      .attr("dy", "1.71em")
      .attr("text-anchor", "middle")
      .text("Tiefe [m]");

    let dots = this.chart.selectAll("dot")
      .data(secData)
      .enter().append("circle")
      .attr("opacity", 0.5)
      .attr("stroke", 'blue')
      .attr("cursor", "pointer")
      .attr("fill", "blue")
      .attr("id", 'dots')
      .attr("r", 1.0)
      .attr("cx", function (d) { return x(d.value); })
      .attr("cy", function (d) { return y(d.depth); })
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html('Chlorophyll: ' + d.value + ' [µg/l]')
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

    let secdots = this.chart.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("opacity", 0.5)
      .attr("stroke", 'red')
      .attr("cursor", "pointer")
      .attr("fill", "red")
      .attr("id", 'dots')
      .attr("r", 1.0)
      .attr("cx", function (d) { return x(d.value); })
      .attr("cy", function (d) { return y(d.depth); })
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html('Temperatur: ' + d.value + ' [C°]')
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
  }

  // set Definitions for Isoplethen diagram and create Graph
  public createIsoPlot() {

    this.num_iso = document.forms.item(1).elements["numIso"].value; 
    this.size_iso = document.forms.item(2).elements["distIso"].value;

    this.createProfileViews();
  }


  /**
   * set up Isoplethen diagram
   */
  public createProfileViews() {

    if (this.plot != undefined) {
      Plotly.purge("myDiv");
    }

    // .classed("svg-content-responsive", true);
    // .attr('width', svgWidth).attr('height', svgHeight);
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", '0 0 ' + svgWidth + ' ' + svgHeight)
    // let width = this.calculateWidth();
    // let height = this.calculateHeight();



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



    // let legend = this.profileSvg.selectAll(".legend")
    //   .data([0].concat(colorScale.quantiles()), function (d) { return d.value; }).enter().append("g")
    //   .attr("class", "legend");

    // legend.append("rect")
    //   .attr("x", function (d, i) { return gridSize * i + margin.left; })
    //   .attr("y", height + margin.top)
    //   .attr("width", gridSize)
    //   .attr("height", gridSize / 3)
    //   .style("fill", function (d, i) { return colors[i]; });

    // legend.append("text")
    //   .attr("class", "mono")
    //   .text(function (d) { return "≥" + Math.round(d); })
    //   .attr("x", function (d, i) { return gridSize * i + margin.left; })
    //   .attr("y", height + margin.top);

    // legend.exit().remove();



    // split dataset in x, y and z values
    let x_dates = [], y_depths = [], z_value = [];
    let p_evaluate = []
    for (let i = 0; i < this.dataset.length; i++) {
      x_dates.push(this.dataset[i].date);
      y_depths.push(this.dataset[i].depth);
      z_value.push(this.dataset[i].value);
      // p_evaluate.push([profData[i].date.getTime(), profData[i].depth])
    }

    // interpolate values
    let coord = [];
    let dataArray = [x_dates, y_depths, z_value];

    for (let i in x_dates) {
      coord.push([x_dates[i], y_depths[i], z_value[i]]);
    }
    let interpolatorArray = [];
    for (let i = 0, k = 1; i < coord.length; i++ , k++) {

      if (dataArray[1][k] >= 20)
        interpolatorArray.push(d3.interpolateObject(coord[i], [dataArray[0][k], dataArray[1][k], dataArray[2][k]]));
    }
    for (let j = 0; j < interpolatorArray.length; j++) {
      let interpH = interpolatorArray[j](0.5);

      x_dates.push(interpH[0]);
      y_depths.push(Math.round(interpH[1]));
      z_value.push(interpH[2]);
    }

    //second interpolation
    let coord2 = [];
    let dataArray2 = [x_dates, y_depths, z_value];
    for (let i in x_dates) {
      coord2.push([x_dates[i], y_depths[i], z_value[i]]);
    }
    let interpolatorArray2 = [];
    for (let i = 0, k = 1; i < coord.length; i++ , k++) {
      if (dataArray[1][k] >= 20)
        interpolatorArray2.push(d3.interpolateObject(coord2[i], [dataArray2[0][k], dataArray2[1][k], dataArray2[2][k]]));
    }
    for (let j = 0; j < interpolatorArray2.length; j++) {
      let interpH = interpolatorArray2[j](0.5);

      x_dates.push(interpH[0]);
      y_depths.push(Math.round(interpH[1]));
      z_value.push(interpH[2]);
    }

    if (this.selectMeasureParam == "Sauerstoff [mg/l]") {
      this.reversedColor = false;
    }
    else {
      this.reversedColor = true;
    }
    console.log(this.autocontourPara);

    /**
     * define dataset for isoplethen graph
     * by defining z,x and y values and coloring and contour definitions
     */
    let contourData = {
      z: z_value,
      x: x_dates,
      y: y_depths,
      type: 'contour',
      colorscale: [[0, colorRgb[0]], [0.25, colorRgb[3]], [0.45, colorRgb[6]]
        , [0.65, colorRgb[9]], [0.85, colorRgb[10]], [1, colorRgb[12]]],

      autocontour: this.autocontourPara,
      ncontours: this.num_iso,
      contours: {
        start: this.start_iso,
        end: this.end_iso,
        size: this.size_iso,
        showlines: false,
      },
      colorbar: {
        title: this.selectMeasureParam,
        titleside: 'right',
        titlefont: {
          size: 14,
          family: 'Arial, sans-serif'
        },
      },
      reversescale: this.reversedColor,
    };

    /**
     * draw borderline for ground surface
     */
    let borderLine = {
      x: this.measureDates,
      y: this.maxDepth,
      type: 'scatter',
      marker: {
        size: 1
      },
      line: {
        width: 10,
        color: 'grey'
      },
      hoverinfo: 'none',
      showlegend: false,
    };

    /**
     *  fill space between graph and borderline of ground
     */
    let groundTruth_Values = [];
    for (let k in this.measureDates) {
      groundTruth_Values.push(d3.max(this.maxDepth))
    }
    let groundTruth = {
      x: this.measureDates,
      y: groundTruth_Values,
      type: 'scatter',
      fill: 'tonexty',
      marker: {
        size: 0.1
      },
      fillcolor: 'white',
      line: {
        width: 0,
        color: 'white'
      },
      showlegend: false,
      hoverinfo: 'none',
    };

    /**
     * set layout of isoplethen graph
     */
    var layout = {
      title: this.dam_label + " " + this.year,
      xaxis: {
        side: 'top',
        tickmode: 'auto',
        nticks: 12,
        range: [new Date(this.year, 0, 1), new Date(this.year, 11, 31)],
        type: 'date'
      },
      yaxis: {
        title: 'Tiefe [m]',
        autorange: 'reversed',
      },
      font: {
        size: 14
      }
    };

    /**
     * set config parameters for plotly modeBar
     */
    var config = {
      toImageButtonOptions: {
        format: 'png',
        height: height,
        width: width,
      },
      displayModeBar: true,
      responsive: true,
      modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines']
    };

    /**
     * define dataset and draw isoplethen graph
     */
    let plotlyData = [contourData, borderLine, groundTruth];
    this.plot = Plotly.newPlot('myDiv', plotlyData, layout, config);


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
