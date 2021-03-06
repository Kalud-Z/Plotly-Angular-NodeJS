let server  = require('websocket').server;
let http    = require('http');

let x_value = 1;
let y_value = 2;
let incrementing = true;

const PORT = 8080;
let connection;
let interval;


let socket = new server({
    httpServer: http.createServer().listen(PORT)
});
console.log('listening on port : ' , PORT);

socket.on('request', request => {
    connection = request.accept(null, request.origin);
    connection.on('message', message => {
        console.log('this is message received from the client : ' , message.utf8Data);
        if(message.utf8Data === 'pause') { stopSendingData() }
        if(message.utf8Data === 'start') { startSendingData() }
    });

    connection.on('close', connection => {
        console.log('connection closed');
        //TODO : close the socket connection on the server.
    });
});



function startSendingData() {
    interval = setInterval(() => {
        setNextCoords();
        let obj = { x_coord: x_value,  y_coord: y_value };
        connection.sendUTF(JSON.stringify(obj));
    }, 40);
    // Ziel : 10ms => 100 'Bilder' pro Sekunde
    // derzeit max 40ms. (rAF ist nicht schnell genug ! | falls  < 40ms :  kommen Verzögerungen vor)
}

function setNextCoords() {
    if(incrementing && x_value < 100) {
        x_value++;
    }

    if(!incrementing && x_value > 1) {
        x_value--;
    }

    if(x_value === 100) {
        incrementing = false;
    }

    else if(x_value === 1) {
        incrementing = true;
    }
}

function stopSendingData() {
    clearInterval(interval);
}


