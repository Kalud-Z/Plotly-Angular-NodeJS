import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';


interface ImageData  {
  rows: number[]
}

@Component({
  selector: 'app-binary-data',
  templateUrl: './binary-data.component.html',
  styleUrls: ['./binary-data.component.scss']
})

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
export class BinaryDataComponent implements OnInit{
  currentIndex: number;
  defaultColorValue = 150;
  rowLength: number;

  imageData = [
    [0 , 0 , 0 , 0 , this.defaultColorValue],
    [0 , 0 , 0 , 0 , this.defaultColorValue],
    [0 , 0 , 0 , 0 , this.defaultColorValue],
    [0 , 0 , 0 , 0 , this.defaultColorValue],
    [0 , 0 , 0 , 0 , this.defaultColorValue],
  ]

  ngOnInit(): void {
    this.rowLength = this.imageData[0].length;
    this.currentIndex = this.rowLength - 1;
  }

  moveBarToLeft() {
    this.imageData.forEach(row => {
      for(let i = 0; i < row.length; i++) {
        if(i === this.currentIndex - 1) { row[i] = this.defaultColorValue }
        else { row[i] = 0 }
      }
    });
    this.currentIndex--;
  }

  moveBarToRight() {
    this.imageData.forEach(row => {
      for(let i = 0; i < row.length; i++) {
        if(i === this.currentIndex + 1) { row[i] = this.defaultColorValue }
        else { row[i] = 0 }
      }
    });
    this.currentIndex++;
  }


  startMovingBar() {
    setInterval(() => {
      if(this.currentIndex <= this.rowLength) {

      }

      if(this.currentIndex === 0) { this.moveBarToRight() }
      if(this.currentIndex === this.rowLength) { this.moveBarToLeft() }
    }, 100)
  }





} //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°


export function getDeepCloneOf(target : any): any {
  return  _.cloneDeep(target);
}
