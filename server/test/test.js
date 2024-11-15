let assert = require('assert')
const request = require('supertest')
const mongoose = require('mongoose')
const express = require('express')
const pino = require('pino')
const bodyParser = require("body-parser");

const validator = require('../utils/validator')
const dbconfig = require('../config/database')
const messageRoutes = require("../apps/routes/message")
const Message = require('../apps/models/messages')

//set up mock app
const app = express()
app.use(bodyParser.json())
const logger = pino({ 
    level: 'fatal',
    transport: { target: 'pino-pretty'}
})
app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err)
    }
    logger.error()
    let status = err.status || 500
    let message = err.message
    return res.status(status).json({ message: message })
})  
dbconfig(mongoose, logger, true)
messageRoutes(app, logger)
let mockData = {
        msg_type: "detections",
        system: "detection_service",
        msg_id: "dKTwtPAs",
        detections: [
            {
                drone_id: "rkaUreZe",
                classification: "OcuSync",
                band: "2.4GHz",
                start_time: "2024-11-15T19:02:02.927Z",
                rssi: "-76.6485",
            },
        ],
        timestamp: "2024-11-15T19:02:02.927Z",
}
let restore = '';

describe('Validator', function () {
    describe('#validateId', function () {
        it('should return false when Id is null', function () {
          assert.equal(false, validator.validateId(null))
        })
        it('should return false when id length is not equal to 8', function () {
            assert.equal(false, validator.validateId('aBceRtd'))
        })
        it('should return false when there is a character in id not in a-z, A-z', function () {
            assert.equal(false, validator.validateId('aBceR4ds'))
        })
        it('should return true when id is length 8 and all characters a-z, A-Z', function () {
            assert.equal(true, validator.validateId('aBceRdds'))
        })
    })
    describe('#validateRssi', function () {
        it('should return false when rssi is null', function () {
            assert.equal(false, validator.validateRssi(null))
        })
        it('should return false when RSSI > -65', function () {
          assert.equal(false, validator.validateRssi(-64))
        })
        it('should return false when RSSI < -110', function () {
            assert.equal(false, validator.validateRssi(-111))
        })
        it('should return true when -110 < RSSI < -65', function () {
            assert.equal(true, validator.validateRssi(-90))
        })
    })
    describe('#validateBand', function () {
        it('should return false when band is null', function () {
            assert.equal(false, validator.validateBand(null))
        })
        it('should return false when band is not 2.4GHz or 5.8GHz', function () {
            assert.equal(false, validator.validateBand('2.4G'))
        })
        it('should return true when band is Ocusync', function () {
            assert.equal(true, validator.validateBand('2.4GHz'))
        })
        it('should return true when band is Lightbridge', function () {
            assert.equal(true, validator.validateBand('5.8GHz'))
        })
    })
    describe('#validateClass', function () {
        it('should return false when classification is null', function () {
            assert.equal(false, validator.validateClass(null))
        })
        it('should return false when classification is not OcuSync or Lightbridge', function () {
            assert.equal(false, validator.validateClass('test'))
        })
        it('should return true when classification is OcuSync', function () {
            assert.equal(true, validator.validateClass('OcuSync'))
        })
        it('should return true when classification is Lightbridge', function () {
            assert.equal(true, validator.validateClass('Lightbridge'))
        })
    })
})

describe('Message Routes', function () {
    before(function(done) {
        mongoose.connection.once('open',function(){
            done()
        })
    });
    describe('POST /api/message/add', function () {
        it('should return 500 when request is invalid', function (done) {
            restore = mockData.msg_id
            mockData.msg_id = '111invalid'
            request(app)
                .post('/api/message/add')
                .send({ message: mockData })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect('Content-Length', '15')
                .expect(500)
                .end(function(err, res) {
                    return done();
            });
            mockData.msg_id = restore
        })
        it('should return 200 and store data when message is valid', function (done) {
             request(app)
                .post('/api/message/add')
                .send({ message: mockData })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    request(app)
                    .get('/api/message/latest')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        assert.equal(res.body.message.msg_id, mockData.msg_id)
                        return done();
                    });
                })
        })
    })
    describe('Get /api/message/latest', function () {
        before(function(done) {
            mockData.msg_id = 'dKTwtPAx'
            mockData.timestamp = Date.now()
            request(app)
                .post('/api/message/add')
                .send({ message: mockData })
                .set('Accept', 'application/json')
                .end(function(err, res) {
                    if (err) return done(err);
                    return done();
                });
        });
        it('should return 200 and retrieve latest message', function (done) {
             request(app)
                .get('/api/message/latest')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.message.msg_id, mockData.msg_id)
                    return done();
             });
        })
    })
    describe('Get /api/message/countData', function () {
        before(function(done) {
            mockData.msg_id = 'dKTwtPAz'
            mockData.timestamp = Date.now()

            mockData.detections[0].drone_id = 'sdTwtPAz'
            mockData.detections[0].band = '5.8GHz'
            mockData.detections[0].classification = 'Lightbridge'
            request(app)
                .post('/api/message/add')
                .send({ message: mockData })
                .set('Accept', 'application/json')
                .end(function(err, res) {
                    if (err) return done(err);
                    return done();
                });
        });
        it('should return 200 and return correct counts', function (done) {
             request(app)
                .get('/api/message/countData')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.countData.messageCount, 3)
                    assert.equal(res.body.countData.bandCountTwo, 1)
                    assert.equal(res.body.countData.bandCountFive, 1)
                    assert.equal(res.body.countData.classificationCountLight, 1)
                    assert.equal(res.body.countData.classificationCountOcu, 1)
                    Message.deleteMany({}).then(response => { console.log('Test DB Reset')})
                    return done();

             });
        })
    })
})

