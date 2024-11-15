const Message = require('../models/messages')
const validator = require('../../utils/validator')
const BAND_CONSTANTS = require('../../config/constants').BAND_CONSTANTS  
const CLASSIFICATION_CONSTANTS = require('../../config/constants').CLASSIFICATION_CONSTANTS  

module.exports = function (app, logger) {
    app.get('/api/message/countData', async (req, res, next) => {
        let messageCount = (await Message.aggregate([{$count: "messageCount"}]).catch((err) => { return next(err) }))[0].messageCount

        let bandCountTwo = (await Message.aggregate([{
            $match: {'detections.band': {$eq: BAND_CONSTANTS.BAND_TWO}}
        }, {
            $unwind: '$detections'
        }, {
            $match: {'detections.band': {$eq: BAND_CONSTANTS.BAND_TWO}}
        }, {
            $group: { _id : '$detections.drone_id' } 
        }, {
            $count: "bandCountTwo"
        }]).catch((err) => { return next(err) }))[0].bandCountTwo

        let bandCountFive = (await Message.aggregate([{
            $match: {'detections.band': {$eq: BAND_CONSTANTS.BAND_FIVE}}
        }, {
            $unwind: '$detections'
        }, {
            $match: {'detections.band': {$eq: BAND_CONSTANTS.BAND_FIVE}}
        }, {
            $group: { _id : '$detections.drone_id' } 
        }, {
            $count: "bandCountFive"
        }]).catch((err) => { return next(err) }))[0].bandCountFive

        let classificationCountLight = (await Message.aggregate([{
            $match: {'detections.classification': {$eq: CLASSIFICATION_CONSTANTS.CLASSIFICATION_LIGHT}}
        }, {
            $unwind: '$detections'
        }, {
            $match: {'detections.classification': {$eq: CLASSIFICATION_CONSTANTS.CLASSIFICATION_LIGHT}}
        }, {
            $group: { _id : '$detections.drone_id' } 
        }, {
            $count: "classificationCountLight"
        }]).catch((err) => { return next(err) }))[0].classificationCountLight

        let classificationCountOcu = (await Message.aggregate([{
            $match: {'detections.classification': {$eq: CLASSIFICATION_CONSTANTS.CLASSIFICATION_OCU}}
        }, {
            $unwind: '$detections'
        }, {
            $match: {'detections.classification': {$eq: CLASSIFICATION_CONSTANTS.CLASSIFICATION_OCU}}
        }, {
            $group: { _id : '$detections.drone_id' } 
        }, {
            $count: "classificationCountOcu"
        }]).catch((err) => { return next(err) }))[0].classificationCountOcu

        let countData = {
            messageCount,
            bandCountTwo,
            bandCountFive,
            classificationCountLight,
            classificationCountOcu
        }
        logger.warn({
            action: 'Count Data Get',
            endpoint: '/api/message/countData',
            data: {
              count_data: countData,
            }
          })
        return res.status(200).json({ countData: countData })
    })
    app.get('/api/message/rssi/:drone_id/:milliseconds', (req, res, next) => {
        const droneId = req.params.drone_id
        const milliseconds = req.params.milliseconds
        const timeAfter = new Date(Date.now() - milliseconds)
  
        Message.aggregate([{
            $match: {
                timestamp: {$gte: timeAfter},
                'detections.drone_id': {$eq: droneId} 
                }
            }, 
            {
                $unwind: '$detections'
             }, 
            {
                $match: {
                    'detections.drone_id': {$eq: droneId} 
                },
            },
            {
                $project: {
                    drone_id: '$detections.drone_id',
                    rssi: '$detections.rssi',
                    timestamp: '$timestamp',
                }
            }
        ])
        .then((rssiValues) => {
            logger.warn({
              action: 'Recent Drone Detections Get',
              endpoint: '/api/message/detections',
              data: {
                detection_count: rssiValues.length,
                param: { 
                    drone_id: droneId,
                    milliseconds: milliseconds
                }
              }
            })
            return res.status(200).json({ rssiValues: rssiValues })
          })
          .catch((err) => {
            return next(err)
          })
    })
    app.get('/api/message/latest', (req, res, next) => {
        Message.findOne({}, {}, { sort: { 'timestamp' : -1 } })
        .then((message) => {
            logger.warn({
              action: 'Latest Message Get',
              endpoint: '/api/message/latest',
              data: {
                msg_id: message.msg_id,
              }
            })
            return res.status(200).json({ message: message })
          })
          .catch((err) => {
            return next(err)
          })
    })
    app.post('/api/message/add', (req, res, next) => {
        const messageData = req.body.message

        //validate
        if (!validator.validateId(messageData.msg_id)) {
            let err = new Error('Not a valid message id')
            err.status = 400
            return next(err) 
        }
        for (let detection of messageData.detections) {
            if (!validator.validateId(detection.drone_id)) {
                let err = new Error('Not a valid drone id')
                err.status = 400
                return next(err) 
            }
            if (!validator.validateBand(detection.band)) {
                let err = new Error('Not a valid band')
                err.status = 400
                return next(err) 
            }
            if (!validator.validateClass(detection.classification)) {
                let err = new Error('Not a valid classification')
                err.status = 400
                return next(err) 
            }
            if (!validator.validateRssi(detection.rssi)) {
                let err = new Error('Not a valid rssi')
                err.status = 400
                return next(err) 
            }
        }

        Message.create(new Message(messageData))
        .then((message) => {
            logger.warn({
              action: 'Message Added Post',
              endpoint: '/api/message/add',
              data: {
                msg_id: message.msg_id,
              }
            })
            return res.status(200).json({ message: message })
          })
          .catch((err) => {
            return next(err)
          })
    })
}