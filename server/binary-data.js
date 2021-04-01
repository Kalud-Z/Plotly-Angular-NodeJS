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
let imageData_array = []

const PORT = 8080;
let connection;
let interval;

const ROWS = 50
const CELLS = 150
const PERIOD = 10;
const STOP_INTERVAL_AFTER = 2000;

let startTime;
timesArrayChanged = 0;

let currentImageDataIndex = 0;
let sendIsCalled = 0;

let socket = new server({
    httpServer: http.createServer().listen(PORT)
});
console.log('listening on port : ' , PORT);

socket.on('request', request => {
    connection = request.accept(null, request.origin);
    // init();
    console.log('client just opened webSocket connection');
    connection.on('message', message => {
        console.log('this is message received from the client : ' , message.utf8Data);
        if(message.utf8Data === 'start') { startSendingData() }
        if(message.utf8Data === 'pause') { stopSendingData()  }
    });

    connection.on('close', connection => {
        console.log('connection closed');
        //TODO : actually close the socket connection on the server.
    });
});



function init() {
    // imageData = [];
    // incrementing = false;
    // initializeImageData(ROWS , CELLS);
    // rowLength = imageData[0].cells.length;
    // currentIndex = rowLength - 1;
    // sendData();
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

// function startSendingData() {
//     startTime = new Date();
//
//     interval = setInterval(() => {
//         // if(incrementing && currentIndex < rowLength) { moveBarToRight() }
//         // if(!incrementing && currentIndex > 0) { moveBarToLeft() }
//         // if(currentIndex === rowLength) { incrementing = false }
//         // else if(currentIndex === 0) { incrementing = true }
//         // sendData();
//         //
//         let timePassed = getTimePassed();
//         if(timePassed >= STOP_INTERVAL_AFTER) {
//             stopSendingData();
//             console.log('Configured Period : ', PERIOD, ' ms')
//             console.log('time passed : ', timePassed);
//             const NrOfIterations_desiredValue = Math.round(timePassed * (1 / PERIOD))
//             console.log('Nr of iterations [Desired Value]  : ', NrOfIterations_desiredValue);
//             // console.log('Nr of iterations [Actual Value] (timesArrayChanged)   : ', timesArrayChanged);
//             console.log('Nr of iterations [Actual Value] (#ofTimes sendData is called)   : ', sendIsCalled);
//             console.log('Nr of iterations missing   : ', NrOfIterations_desiredValue - sendIsCalled);
//         }
//
//         sendData();
//         currentImageDataIndex++;
//     }, PERIOD)
//     // <= 40ms  : a lot of lagging and the 'pause' doesnt work !
//     // the higher the frequency the     more time it takes to pause , when pause clicked.
// }


function startSendingData() {
    console.log('length of array : ' , imageData_array.length);
    startTime = new Date();

    for(let i = 0 ; i < 100 ; i++) {
        sendData();
        console.log('time passed : ', getTimePassed());
    }
}

function sendData() {
    sendIsCalled++;
    currentImageDataIndex++;
    let obj = { currentArray: imageData_array[currentImageDataIndex] };
    connection.sendUTF(JSON.stringify(obj));
    console.log('sendIsCalled : ' , sendIsCalled);
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
    imageData_array.push(imageData);
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
    imageData_array.push(imageData);
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


function generateData() {
    imageData = [];
    incrementing = false;
    initializeImageData(ROWS , CELLS);
    rowLength = imageData[0].cells.length;
    currentIndex = rowLength - 1;

    for(let i = 0 ; i < CELLS ; i++) {
        if(incrementing && currentIndex < rowLength) { moveBarToRight() }
        if(!incrementing && currentIndex > 0) { moveBarToLeft() }
        if(currentIndex === rowLength) { incrementing = false }
        else if(currentIndex === 0) { incrementing = true }
    }

}
generateData();
