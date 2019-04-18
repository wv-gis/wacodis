import { Component, OnInit } from '@angular/core';
import { CsvDataService } from 'src/app/settings/csvData.service';
import * as d3 from 'd3';
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


@Component({
  selector: 'wv-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})

export class ProfileViewComponent implements OnInit {

  public headers: string[] = [];
  public entries = [];
  public entry;
  public responseText: string;
  public currentPage;
  public dataArr: string[];
  public bwlData: BwlDataset[] = [];

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

    const svgWidth = 1000, svgHeight = 650;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;
    let xaxisHeight = svgHeight - margin.bottom;
    let svg = d3.select("#d3Graph").append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", '0 0 ' + svgWidth + ' ' + svgHeight)
    .classed("svg-content-responsive", true);
    // .attr('width', svgWidth).attr('height', svgHeight);

    let data = [{
      date: new Date(2019, 0, 1),
      value: 24.45
    },
    {
      date: new Date(2019, 0, 2),
      value: 23.12
    }, {
      date: new Date(2019, 0, 3),
      value: 22.05
    }, {
      date: new Date(2019, 0, 4),
      value: 18.34
    }, {
      date: new Date(2019, 0, 5),
      value: 23.10
    }, {
      date: new Date(2019, 0, 6),
      value: 15.10
    }, {
      date: new Date(2019, 0, 7),
      value: 20.63
    }, {
      date: new Date(2019, 0, 8),
      value: 24.23
    }, {
      date: new Date(2019, 0, 9),
      value: 26.24
    }, {
      date: new Date(2019, 0, 10),
      value: 20.13
    },
    ];


    let secData = [{
      date: new Date(2019, 0, 1),
      value: 10.45
    },
    {
      date: new Date(2019, 0, 2),
      value: 14.12
    }, {
      date: new Date(2019, 0, 3),
      value: 14.05
    }, {
      date: new Date(2019, 0, 4),
      value: 12.34
    }, {
      date: new Date(2019, 0, 5),
      value: 13.10
    }, {
      date: new Date(2019, 0, 6),
      value: 15.10
    }, {
      date: new Date(2019, 0, 7),
      value: 13.63
    }, {
      date: new Date(2019, 0, 8),
      value: 13.23
    }, {
      date: new Date(2019, 0, 9),
      value: 12.24
    }, {
      date: new Date(2019, 0, 10),
      value: 40.13
    },
    ];

    let x = d3.scaleTime().rangeRound([0, width]);
    let y = d3.scaleLinear().rangeRound([height, 0]);

    let line = d3.line()
      .x(function (d) { return x(d.date); })
      .y(function (d) { return y(d.value); });


    let secLine = d3.line()
      .x(function (d) { return x(d.date); })
      .y(function (d) { return y(d.value); });

    x.domain(d3.extent(data, function (d) { return d.date }));

    let chart = svg.append('g').attr('transform', 'translate(' + margin.left + "," + margin.top + ")");

    let d3Max = d3.max(data, function(d){return d.value}) as number;
    let d3MaxSec = d3.max(secData, function(d){return d.value}) as number;

    console.log(Math.max(d3Max, d3MaxSec));
    let max =Math.max(d3Max, d3MaxSec);

    y.domain([0,max ]);
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin.left + ',' + xaxisHeight + ")")
      .call(d3.axisBottom(x))


    chart.append('path')
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr('d', line);

    chart.append('path')
      .datum(secData)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr('d', secLine);

    chart.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Mio m³");


    // let xr = d3.scaleLinear().rangeRound([0, width]);
    let yr = d3.scaleLinear().rangeRound([height,0]);
    // xr.domain([0, secData.length]);
    yr.domain([0, d3.max(secData, function (d) { return d.value; })]);
    chart.append("g")
      .attr("transform", "translate(" + width + ',' +  "0 )")
      .call(d3.axisRight(yr))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-360)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("rain (mm)");
    chart.selectAll("rect")
      .data(secData)
      .enter()
      .append("svg:rect")
      .style("fill", "steelblue")
      .attr("x", function (d, i) { return x(d.date); })
      .attr("width", 2)
      .attr("y", function (d) { return  yr(d.value); })
      .attr("height", function (d) { return height-yr(d.value); });
    console.log(new Date(2019,0,1));
  }


  /**
   * not suitable for dtae and value fields as strings
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
