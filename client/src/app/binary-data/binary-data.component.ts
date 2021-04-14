import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';



@Component({
  selector: 'app-binary-data',
  templateUrl: './binary-data.component.html',
  styleUrls: ['./binary-data.component.scss']
})

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
export class BinaryDataComponent implements OnInit {
  connectionOpened = false;
  incrementing = true;

  // private animFrame: any;
  socket: WebSocket;
  imageData = []
  private receivedData = 0;
  timePassed: number;
  startTime: Date;

  ngOnInit(): void {
    // this.initializeImageData(256 , 256);
    this.openConnection();
  }

  openConnection() {
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onerror = error => console.log('WebSocket error: ' + error);
    this.socket.onclose = () => console.log('the client just closed the webSocket Connection');
    this.socket.onopen = () => {
      // this.startReceivingData();
      this.connectionOpened = true;
      this.socket.onmessage = message => {
        this.receivedData++;
        if(this.receivedData === 2) {
          this.startTime = new Date();
        }
        let data:any = JSON.parse(message.data);
        console.log('receivedData : ' , this.receivedData);
        // console.log('data received.');
        this.imageData  = data.currentArray;
        console.log('this is ht e data : ' , this.imageData);
        this.timePassed = this.getTimePassed();
      };
    }
  }


  startReceivingData() {
    this.socket.send('start');
  }

  stopMoving() {
    // cancelAnimationFrame(this.animFrame);
    this.socket.send('pause');
  }

  closeConnection() {
    this.socket.close()
    this.connectionOpened = false;
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


  trackById(index: number, item: any) {
    // console.log('trackbyId is called')
    return item.id;
  }


  getTimePassed() {
    let start = moment(this.startTime);
    let currentTime = moment(new Date());
    const gg = currentTime.diff(start , 'ms')
    return  gg; // 1
  }




} //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°





export function getDeepCloneOf(target : any): any {
  return  _.cloneDeep(target);
}



