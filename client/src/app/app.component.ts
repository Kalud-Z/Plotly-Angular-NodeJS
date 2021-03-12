import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Plotly from 'plotly.js-dist';


interface Coordinates {
  x_coord: number;
  y_coord: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("Graph", { static: true })  private Graph: ElementRef;

  connectionOpened = false;

  private animFrame: any;

  socket: any;

  private x_value = 10;
  private y_value = 1;

  incrementing = true;

  markerSize: number = 20;

  ngOnInit(): void {

  }


  openConnection() {
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onerror = error => console.log('WebSocket error: ' + error);
    this.socket.onclose = () => console.log('the server just closed the webSocket Connection');
    this.socket.onopen = () => {
      // this.startReceivingData();
      this.connectionOpened = true;
    }
  }

  startReceivingData() {
    this.socket.send('start');

    this.socket.onmessage = message => {
      let data: Coordinates = JSON.parse(message.data);
      console.log(data);
      this.x_value = data.x_coord;
      this.y_value = data.y_coord;
      console.log('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§');
      this.startMoving();
    };
  }

  closeConnection() {
    this.socket.close()
    this.connectionOpened = false;
  }







  ngAfterViewInit() {
    this.initialize();
  }

  initialize() {
    Plotly.plot(this.Graph.nativeElement, [{
      x: [this.x_value],
      y: [this.y_value],
      mode: 'markers',
      marker: {
        color: 'rgb(17, 157, 255)',
        size: 20,
      }
    }], {
      xaxis: {
        range: [0, 100],
        fixedrange: true,
        title: {
          text: 'range / cm',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      },
      yaxis: {
        fixedrange: true,
        range: [-7, 7],
        title: {
          text: 'velocity / m/s',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      }
    }, {displayModeBar: false} )
  }

  compute() {
    if(this.x_value === 100) {
      this.incrementing = !this.incrementing;
    }

    if(this.x_value === 1) {
      this.incrementing = !this.incrementing;
    }

    if(this.incrementing && this.x_value < 100) {
      this.x_value += 1;
    }
    else if(!this.incrementing && this.x_value > 1) {
      this.x_value -= 1;
    }

  }

  update() {
    // this.compute();
    // console.log('x value : ' , this.x_value)
    // console.log('y value : ' , this.y_value)
    // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    this.setMarkerSize();

    Plotly.animate(this.Graph.nativeElement, {
      data: [
        { x: [this.x_value],
          y: [this.y_value],
          marker: {
            color: 'rgb(17, 157, 255)',
            size: this.markerSize,
          }
        }
        ]
    }, {
      transition: {
        duration: 10,
      },
      frame: {
        duration: 10,
        redraw: false,
      }
    });

    // this.animFrame = requestAnimationFrame(this.update.bind(this));
  }

  startMoving() {
    this.animFrame = requestAnimationFrame(this.update.bind(this));
  }

  stopMoving() {
    cancelAnimationFrame(this.animFrame);
    this.socket.send('pause');
  }


  private setMarkerSize() {
    if(this.x_value < 15) {
      this.markerSize = 100 - (this.x_value * 1.5);
    }


    else if(this.x_value > 65) {
      this.markerSize = 100 - (this.x_value / 1.15);
    }

    else {
      this.markerSize = 100 - this.x_value;
    }
  }


} //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°





//without requestFrameAnimation
// start() {
//   Plotly.newPlot(this.Graph.nativeElement, {
//     data: [
//       { x: [15],
//         y: [3],
//         marker: {
//           color: 'rgb(17, 157, 255)',
//           size: 20,
//           line: {
//             color: 'rgb(231, 99, 250)',
//             width: 2
//           }
//         }, }
//     ],
//     layout: {
//       xaxis: {
//         range: [0, 100],
//         fixedrange: true
//       },
//       yaxis: {
//         range: [-5, 5],
//         fixedrange: true
//       }
//     },
//   });
// }
//
// ngAfterViewInit(): void {
//   this.start();
// }
//
// randomize() {
//   // Plotly.animate(this.Graph.nativeElement, {
//   //   // data: [
//   //   //   // { y: [Math.random(), Math.random(), Math.random()] },
//   //   //   { y: [6] },
//   //   //   ],
//   //   data: [
//   //     { x: [0], y: [0] }
//   //   ],
//   //   traces: [0],
//   //   layout: {}
//   // }, {
//   //   transition: {
//   //     duration: 0,
//   //     easing: 'linear'
//   //   },
//   //   frame: {
//   //     duration: 0
//   //   }
//   // })
//
//
// }
//
// moveAway() {
//   let x_initialValue = 0;
//   let numberOfPics = 0;
//
//   setInterval(() => {
//     numberOfPics++;
//     console.log('num of pics : ' , numberOfPics);
//     x_initialValue += 10;
//     Plotly.animate(this.Graph.nativeElement, {
//       data: [
//         { x: [x_initialValue], y: [0] }
//       ],
//       traces: [0],
//       layout: {}
//     });
//   } , 1000);
//
// }
