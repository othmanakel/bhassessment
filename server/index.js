const express = require('express')
const mongoose = require('mongoose')
const pino = require('pino')
const bodyParser = require('body-parser')
const cors = require('cors')

const dbconfig = require('./config/database')
const messageRoutes = require('./apps/routes/message')
const simulateDetections = require('./simulation/simulateDetections')

const app = express()
const port = process.env.PORT || 3000

//logging
const logger = pino({ 
    level: process.env.LOG_LEVEL || 'warn', //change to info statically on in env variables to see more detailed logs
    transport: { target: 'pino-pretty'}
}) 

//config
dbconfig(mongoose, logger)

//express setup
app.use(bodyParser.json())

//routes
messageRoutes(app, logger)

//error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err)
    }
    logger.error({ err: err })
    let status = err.status || 500
    let message = err.message
    return res.status(status).json({ message: message })
  })  

app.listen(port, () => logger.info(
    `Listening on port ${port}!`
))

setTimeout(function() { simulateDetections(logger) }, 3000)
