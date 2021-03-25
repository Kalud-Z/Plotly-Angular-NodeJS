let _ = require('lodash');
let moment = require('moment');
let uniqid = require('uniqid');


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

const ROWS = 50
const CELLS = 150
const FREQUENCY = 10;

let startTime;
timesArrayChanged = 0;



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
    initializeImageData(ROWS , CELLS);
    // rowLength = imageData[0].length;
    rowLength = imageData[0].cells.length;
    currentIndex = rowLength - 1;
    sendData();
}

function initializeImageData(howManyRows, howManyCells) {
    for(let i = 0; i < howManyRows; i++) {
        let rowObj = { id: 'row-'+uniqid(), cells : [] }
        imageData.push(rowObj);
    }

    for(let i = 0; i < howManyRows ; i++) {
        for(let j = 0; j < howManyCells ; j++) {
            let point = {
                id: 'cell-' + uniqid(),
                value: 0,
            }
            imageData[i].cells.push(point);
        }
    }
}

function startSendingData() {
    startTime = new Date();

    interval = setInterval(() => {
        if(incrementing && currentIndex < rowLength) { moveBarToRight() }
        if(!incrementing && currentIndex > 0) { moveBarToLeft() }
        if(currentIndex === rowLength) { incrementing = false }
        else if(currentIndex === 0) { incrementing = true }
        sendData();

        let timePassed = getTimePassed();
        if(timePassed >= 5000) {
            stopSendingData();
            console.log('Configured Frequency : ', FREQUENCY, ' ms')
            console.log('time passed : ', timePassed);
            const NrOfIterations_desiredValue = Math.round(timePassed * (1 / FREQUENCY))
            console.log('Nr of iterations [Desired Value]  : ', NrOfIterations_desiredValue);
            console.log('Nr of iterations [Actual Value]   : ', timesArrayChanged);
            console.log('Nr of iterations missing   : ', NrOfIterations_desiredValue - timesArrayChanged);
        }

    }, FREQUENCY)
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
    // console.log('moveBarToLeft called');

    let tempArray = getDeepCloneOf(imageData);

    tempArray.forEach(row => {
        for(let i = 0; i < row.cells.length; i++) {
            if(i === currentIndex - 1) { row.cells[i].value = defaultColorValue }
            else { row.cells[i].value = 0 }
        }
    });

    imageData = tempArray;
    timesArrayChanged++;

    currentIndex--;
}

function moveBarToRight() {
    // console.log('moveBarToRight called');

    let tempArray = getDeepCloneOf(imageData);

    tempArray.forEach(row => {
        for(let i = 0; i < row.cells.length; i++) {
            if(i === currentIndex + 1) { row.cells[i].value = defaultColorValue }
            else { row.cells[i].value = 0 }
        }
    });

    imageData = tempArray;
    timesArrayChanged++;
    currentIndex++;
}



function getDeepCloneOf(target) {
    return  _.cloneDeep(target);
}


function getTimePassed() {
    let start = moment(startTime);
    let currentTime = moment(new Date());
    const gg = currentTime.diff(start , 'ms')
    return  gg; // 1
}
