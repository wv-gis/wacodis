# Wacodis Web Client
<p align="center">
  <img src="https://raw.githubusercontent.com/WaCoDiS/apis-and-workflows/master/misc/logos/wacodis.png" width="200">
</p>
Web application components for the visualization of remote sensing data and in-situ information within the research project: 
Copernicus-based services for monitoring material inputs in watercourses and dams – WaCoDiS

 https://wacodis.fbg-hsbo.de/

## Modules 
The WaCoDiS Web Client project consists of different views for data depiction of satellite data and in-situ data. These views are splitted into different modules.

**Copernicus Remote Sensing Reports** 
* copernicus module 
Reports with Information for land classification, vitality density, chlorophyll within dams and surface temperature for the Wupper Area
<p align="center">
  <img src="assets/images/Landbedeckung.png" height="100">
</p>

**Change Detection**  
* change detection module
Compare different Satellite products or dates of the same product to detect changes
<p align="center">
  <img src="assets/images/ChangeDetection.PNG" height="100">
</p>

**Water management Report**  
* reports module
Report to depict the storage content of dams in comparison to dry years and isoplethen profile visualisation of oxygen values at the Große Dhünn Talsperre
<p align="center">
  <img src="assets/images/WaWiBericht.PNG" height="100">
</p>
<p align="center">
  <img src="assets/images/Isoplethen.PNG" height="100">
</p>

**Modelling Results**  
* swat module
Results of the susbtrance entry model (SWAT) for the Area of the "Obere Wupper" for sediment and nitrogen
<p align="center">
  <img src="assets/images/modellierung_Bericht.PNG" height="100">
</p>

**Timeseries Data**  
* timeseries module
Select and depict Sensor Data of measuring stations within the Wupper area in a diagram

**Map Visualisation**
* map module
Display service within map and define Layer options like opacity, legend, visibility

## Third-Party Packages used
* esri-leaflet
* esri-leaflet-renderers
* leaflet
* plotly.js-dist 
* helgoland-toolbox
* d3.js
* leaflet-timedimension
* leaflet.markercluster
* leaflet.sync
* bootstrap
* d3-delaunay
* ol

## Settings
For Sentinel Data requests a client Id and secret must be provided for the request token service.
No guarantee that the services are still available due to ending support of project.
long term mean for temperature and rain data

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

### Troubleshooting
 bug-fixing line 34472 add .apply(self) plotly.js-dist

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.



## License 
Copyright [2020]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## Contact
|    Name   |   Organization    |    Mail    |
| :-------------: |:-------------:| :-----:|
| Verena Kirstein | Wupperverband | vkn@wupperverband.de |
| Christian Förster | Wupperverband | cfr@wupperverband.de |

## Credits and Contributing Organizations
- Department of Geodesy, Bochum University of Applied Sciences, Bochum
- 52° North Initiative for Geospatial Open Source Software GmbH, Münster
- Wupperverband, Wuppertal
- EFTAS Fernerkundung Technologietransfer GmbH, Münster

The research project WaCoDiS is funded by the BMVI as part of the [mFund programme](https://www.bmvi.de/DE/Themen/Digitales/mFund/Ueberblick/ueberblick.html)  
<p align="center">
  <img src="https://raw.githubusercontent.com/WaCoDiS/apis-and-workflows/master/misc/logos/mfund.jpg" height="100">
  <img src="https://raw.githubusercontent.com/WaCoDiS/apis-and-workflows/master/misc/logos/bmvi.jpg" height="100">
</p>