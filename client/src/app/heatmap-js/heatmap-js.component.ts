import { Component, OnInit } from '@angular/core';

// declare var h337;

import * as h337 from 'heatmap.js';
import { Heatmap } from 'heatmap.js';


@Component({
  selector: 'app-heatmap-js',
  templateUrl: './heatmap-js.component.html',
  styleUrls: ['./heatmap-js.component.scss']
})

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
export class HeatmapJSComponent  {

  heatmapInstance: Heatmap<any, any, any>;

  points = [];
  max = 0;
  width = 840;
  height = 400;
  len = 200;

  data: any;



  ngAfterViewInit(): void {
    console.log('this is h337 : ' , h337);

    this.heatmapInstance = h337.create({
      // only container is required, the rest will be defaults
      container: document.querySelector('.heatmap')
    });

    console.log('this is heatmapInstance : ' , this.heatmapInstance);

    this.generateRandomPoints();
    this.drawTheHeatMap();

    console.log('data : ' , this.data)
  }


  generateRandomPoints() {
    while (this.len--) {
      let val = Math.floor(Math.random()*255);
      this.max = Math.max(this.max, val);
      let point = {
        x: Math.floor(Math.random()*this.width),
        y: Math.floor(Math.random()*this.height),
        value: val
      };
      this.points.push(point);
    }


    this.data = {
      max: this.max,
      data: this.points
    };

  }



  drawTheHeatMap() {
    // if you have a set of datapoints always use setData instead of addData
    // for data initialization
    this.heatmapInstance.setData(this.data);
  }



}  //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°



//
// heatmapJS :
//   this is the data format :
//   array of object_X
// object_X ==>  {x: 608, y: 35, value: 251}
