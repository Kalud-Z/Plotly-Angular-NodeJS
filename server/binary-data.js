let server  = require('websocket').server;
let http    = require('http');

let currentIndex;
let defaultColorValue = 150;
let rowLength;
let incrementing = false;
let imageData = []

const PORT = 8080;
let connection;
let interval;



let socket = new server({
    httpServer: http.createServer().listen(PORT)
});
console.log('listening on port : ' , PORT);

socket.on('request', request => {
    connection = request.accept(null, request.origin);
    init();
    console.log('client just opened webSocket connection');
    connection.on('message', message => {
        console.log('this is message received from the client : ' , message.utf8Data);
        if(message.utf8Data === 'start') { startSendingData() }
        if(message.utf8Data === 'pause') { stopSendingData() }
    });

    connection.on('close', connection => {
        console.log('connection closed');
        //TODO : actually close the socket connection on the server.
    });
});



function init() {
    imageData = [];
    incrementing = false;
    initializeImageData(20 , 60);
    rowLength = imageData[0].length;
    currentIndex = rowLength - 1;
    sendData();
}

function initializeImageData(howManyRows, howManyCells) {
    for(let i = 0; i < howManyRows ; i++) { imageData.push([]) }

    for(let i = 0; i < howManyRows ; i++) {
        for(let j = 0; j < howManyCells ; j++) { imageData[i].push(0) }
    }
}

function startSendingData() {
    interval = setInterval(() => {
        if(incrementing && currentIndex < rowLength) { moveBarToRight() }
        if(!incrementing && currentIndex > 0) { moveBarToLeft() }
        if(currentIndex === rowLength) { incrementing = false }
        else if(currentIndex === 0) { incrementing = true }
        sendData();
    }, 100)
    // <= 40ms  : a lot of lagging and the 'pause' doesnt work !
    // the higher the frequency the     more time it takes to pause , when pause clicked.
}

function sendData() {
    let obj = { currentArray: imageData };
    connection.sendUTF(JSON.stringify(obj));
}

function stopSendingData() {
    clearInterval(interval);
}

function moveBarToLeft() {
    console.log('moveBarToLeft called');
    imageData.forEach(row => {
        for(let i = 0; i < row.length; i++) {
            if(i === currentIndex - 1) { row[i] = defaultColorValue }
            else { row[i] = 0 }
        }
    });
    currentIndex--;
}

function moveBarToRight() {
    console.log('moveBarToRight called');
    imageData.forEach(row => {
        for(let i = 0; i < row.length; i++) {
            if(i === currentIndex + 1) { row[i] = defaultColorValue }
            else { row[i] = 0 }
        }
    });
    currentIndex++;
}

