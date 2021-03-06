import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Plotly from 'plotly.js-dist';


interface Coordinates {
  x_coord: number;
  y_coord: number;
}


@Component({
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.scss']
})

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
export class PlotlyComponent {
  @ViewChild("Graph", { static: true })  private Graph: ElementRef;

  connectionOpened = false;
  incrementing = true;

  private animFrame: any;
  socket: WebSocket;

  x_value = 10;
  y_value = 1;

  markerSize: number = 20;

  openConnection() {
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onerror = error => console.log('WebSocket error: ' + error);
    this.socket.onclose = () => console.log('the client just closed the webSocket Connection');
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
        duration: 0,
      },
      frame: {
        duration: 0,
        // redraw: false,
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


} //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
