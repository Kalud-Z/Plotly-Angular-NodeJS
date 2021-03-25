import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import uniqid from 'uniqid'


const ROWS = 50
const CELLS = 150
const FREQUENCY = 50 // ms

interface RowObj {
  id: string;
  cells? : Point[];
}

interface Point {
  id: string;
  value: number;
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
  startTime: Date;

  interval;
  timesIntervalCalled: number = 0;
  timesArrayChanged: number = 0;

  imageData = [
    // [0 , 0 , 0 , 0 , this.defaultColorValue],
    // [0 , 0 , 0 , 0 , this.defaultColorValue],
    // [0 , 0 , 0 , 0 , this.defaultColorValue],
    // [0 , 0 , 0 , 0 , this.defaultColorValue],
    // [0 , 0 , 0 , 0 , this.defaultColorValue],
  ]


  ngOnInit(): void {
    this.initializeImageData(ROWS , CELLS);

    // console.log(this.imageData);

    this.rowLength = this.imageData[0].cells.length;
    this.currentIndex = this.rowLength - 1;

    // console.log('this is row length : ' , this.rowLength)
    // console.log('this is current Index : ' , this.currentIndex)
  }

  initializeImageData(howManyRows: number, howManyCells: number) {
    for(let i = 0; i < howManyRows; i++) {
      let rowObj: RowObj = { id: 'row-'+uniqid(), cells : [] }
      this.imageData.push(rowObj);
    }

    for(let i = 0; i < howManyRows ; i++) {
      for(let j = 0; j < howManyCells ; j++) {
        let point: Point = {
          id: 'cell-' + uniqid(),
          value: 0,
        }
        this.imageData[i].cells.push(point);
      }
    }

    // console.log('this iss the initial array : ' , this.imageData);
  }

  moveBarToLeft() {
    // console.log('moveBarToLeft called');

    let tempArray = getDeepCloneOf(this.imageData);

    tempArray.forEach(row => {
      for(let i = 0; i < row.cells.length; i++) {
        if(i === this.currentIndex - 1) { row.cells[i].value = this.defaultColorValue }
        else { row.cells[i].value = 0 }
      }
    });

    this.imageData = tempArray;

    this.timesArrayChanged++;
    // console.log('array changed : ' , this.timesArrayChanged)

    this.currentIndex--;
  }

  moveBarToRight() {
    // console.log('moveBarToRight called');

    let tempArray = getDeepCloneOf(this.imageData);

    tempArray.forEach(row => {
      for(let i = 0; i < row.cells.length; i++) {
        if(i === this.currentIndex + 1) { row.cells[i].value = this.defaultColorValue }
        else { row.cells[i].value = 0 }
      }
    });

    this.imageData = tempArray;
    this.timesArrayChanged++;
    // console.log('array changed. moved to the right')
    // console.log('array changed : ' , this.timesArrayChanged)
    this.currentIndex++;
  }


  startMovingBar() {
    this.startTime = new Date();



    this.interval =  setInterval(() => {
      if(this.incrementing && this.currentIndex < this.rowLength) { this.moveBarToRight() }

      if(!this.incrementing && this.currentIndex > 0) { this.moveBarToLeft() }

      if(this.currentIndex === this.rowLength) {
        this.incrementing = false;
      }

      else if(this.currentIndex === 0) {
        this.incrementing = true;
      }

      let timePassed = this.getTimePassed();
      if(timePassed >= 5000) {
        this.stopMoving();
        console.log('Configured Frequency : ' , FREQUENCY , ' ms')
        console.log('time passed : ' , timePassed);
        const NrOfIterations_desiredValue = Math.round(timePassed * (1 / FREQUENCY))
        console.log('Nr of iterations [Desired Value]  : ' , NrOfIterations_desiredValue);
        console.log('Nr of iterations [Actual Value]   : ' , this.timesArrayChanged);
        console.log('Nr of iterations missing   : ' , NrOfIterations_desiredValue - this.timesArrayChanged);
      }
    }, FREQUENCY)
  }

  stopMoving() {
    clearInterval(this.interval)
  }


  trackById(index: number, item: Point | RowObj) {
    // console.log('trackbyId is called')
    return item.id;
  }



  determineColor(value: number) {
    // console.log('determineColor is called');
    if(value === 0) { return 'blue' }
    if(value === 50) { return 'blue' }
    if(value === 100) { return 'red' }
    if(value === 150) { return 'yellow' }
    if(value === 200) { return 'gray' }
    if(value === 250) { return 'pink' }
  }

  private getTimePassed(): number {
    let start = moment(this.startTime);
    let currentTime = moment(new Date());
    return currentTime.diff(start , 'ms') // 1
  }


} //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°


export function getDeepCloneOf(target : any): any {
  return  _.cloneDeep(target);
}
