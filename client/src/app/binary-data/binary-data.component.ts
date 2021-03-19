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
  incrementing = false;

  imageData = [
    // [0 , 0 , 0 , 0 , this.defaultColorValue],
    // [0 , 0 , 0 , 0 , this.defaultColorValue],
    // [0 , 0 , 0 , 0 , this.defaultColorValue],
    // [0 , 0 , 0 , 0 , this.defaultColorValue],
    // [0 , 0 , 0 , 0 , this.defaultColorValue],
  ]

  ngOnInit(): void {
    // this.initializeImageData(256 , 256);
    this.initializeImageData(25 , 70);

    console.log(this.imageData);

    this.rowLength = this.imageData[0].length;
    this.currentIndex = this.rowLength - 1;

  }

  initializeImageData(howManyRows: number, howManyCells: number) {
    for(let i = 0; i < howManyRows ; i++) {
      this.imageData.push([]);
    }

    for(let i = 0; i < howManyRows ; i++) {
      for(let j = 0; j < howManyCells ; j++) {
        this.imageData[i].push(0);
      }
    }
  }

  moveBarToLeft() {
    console.log('moveBarToRight called');
    this.imageData.forEach(row => {
      for(let i = 0; i < row.length; i++) {
        if(i === this.currentIndex - 1) { row[i] = this.defaultColorValue }
        else { row[i] = 0 }
      }
    });
    this.currentIndex--;
  }

  moveBarToRight() {
    console.log('moveBarToRight called');
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
      if(this.incrementing && this.currentIndex < this.rowLength) {
        this.moveBarToRight()
      }

      if(!this.incrementing && this.currentIndex > 0) {
        this.moveBarToLeft()
      }

      if(this.currentIndex === this.rowLength) {
        this.incrementing = false;
      }

      else if(this.currentIndex === 0) {
        this.incrementing = true;
      }

    }, 100)
  }

} //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°


export function getDeepCloneOf(target : any): any {
  return  _.cloneDeep(target);
}
