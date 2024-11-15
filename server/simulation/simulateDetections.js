const axios = require('axios')

const SIM_CONSTANTS = {
    MSG_TYPE: 'detections',
    SYSTEM: 'detection_service',
    BAND: {
        TWO: '2.4GHz',
        FIVE: '5.8GHz'
    },
    CLASSIFICATION: {
        OCUSYNC: 'OcuSync',
        LIGHTBRIDGE: 'Lightbridge'
    }
}

let pastDetections = []
let localLogger = null

module.exports = function (logger) {
    localLogger = logger
    repeatDetections()
}

function repeatDetections() {
    sendMessage(buildMessage())
    setTimeout(repeatDetections, 3000)
}

function sendMessage(data) {
    axios.post('http://localhost:3000/api/message/add', { "message": data })
    .then(response => {
        localLogger.info({
            action: 'Simulate Post Message',
            message: response.data
        })
    })
    .catch(err => {
        if (err.response) {
            localLogger.error({ err: err.response.data.message })
        }
    })

    pastDetections = data.detections
}

function buildMessage() {
    return {
        'msg_type': SIM_CONSTANTS.MSG_TYPE,
        'system': SIM_CONSTANTS.SYSTEM,
        'msg_id': generateID(),
        'detections': buildDetections(),
        'timestamp': Date.now()
    }
}

function buildDetections() {
    let decetionRandomizer = Math.round(Math.random() * 3) + 1 //get random # of detections between 1 and 4

    let detections = []
    for (let i = 0; i < decetionRandomizer; i++) {
        detections.push(buildDetection())
    }

    for (let detection of pastDetections) {
        let isStillDetected = Math.random() <= .8 //80 percent chance still detected
        if (isStillDetected) {
            detection.rssi = generateRSSI(detection.rssi)
            detections.push(detection)
        }
    }

    return detections
}

function buildDetection() {
    let bandRandomizer = Math.round(Math.random()) //randomizes between the two bands
    let classRandomizer = Math.round(Math.random()) //randomizes between the two classifications

    return {
        'drone_id': generateID(),
        'start_time': Date.now(),
        'band': bandRandomizer ? SIM_CONSTANTS.BAND.TWO : SIM_CONSTANTS.BAND.FIVE,
        'classification': classRandomizer ? SIM_CONSTANTS.CLASSIFICATION.OCUSYNC : SIM_CONSTANTS.CLASSIFICATION.LIGHTBRIDGE,
        'rssi': generateRSSI()
    }
}

function generateID() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"
    let string_length = 8
    let id = ''
    for (let i = 0; i < string_length; i++) {
        let rnum = Math.floor(Math.random() * chars.length)
        id += chars[rnum]
    }
    return id
}

function generateRSSI(prevRssi) {
    let rssi
    if (prevRssi) {
        let addSubtractRandomizer = Math.round(Math.random()) //randomizes between adding and subtracting to previous rssi
        let randomValue = (Math.random() * 6) + .1 //get a random float between .1 and 6
        rssi = addSubtractRandomizer ? parseFloat(prevRssi) + randomValue : parseFloat(prevRssi) - randomValue
        //adjust values if they fall outside range
        if (rssi >= -65) rssi = -65 - ((Math.random() * 6) + .1)
        if (rssi <= -110) rssi = -110 + ((Math.random() * 6) + .1)
    } else {
        rssi = (Math.random() * (-65 - (-110)) + (-110)) //get a random number between -110 and -65 exclusive
    }
    return rssi.toFixed(4)
}

