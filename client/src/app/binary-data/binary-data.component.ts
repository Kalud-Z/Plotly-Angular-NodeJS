import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-binary-data',
  templateUrl: './binary-data.component.html',
  styleUrls: ['./binary-data.component.scss']
})

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
export class BinaryDataComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  image = [
    [50 , 100 , 150 , 200],
    [50 , 100 , 150 , 200],
    [50 , 100 , 150 , 200],
    [50 , 100 , 150 , 200],
    [50 , 100 , 150 , 200],
  ]

  getColor(value: number): string {
    if(value === 50) { return 'blue' }
    if(value === 100) { return 'red' }
    if(value === 150) { return 'yellow' }
    if(value === 200) { return 'gray' }
  }





} //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
