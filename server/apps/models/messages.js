const mongoose = require('mongoose')

const DetectionSchema = new mongoose.Schema(
    {
        drone_id: {
            type: String,
            required: true
        },
        classification : {
            type: String,
            required: true
        },
        band : {
            type: String,
            required: true,
        },
        start_time: {
            type: Date,
            required: true
        },
        rssi : {
            type: String,
            required: true,
        },
          
    }
)

const MessageSchema = new mongoose.Schema(
    {
      msg_type: {
        type: String,
        required: true,
        index: true
      },
      system : {
        type: String,
        required: true
      },
      msg_id: {
        type: String,
        required: true,
        unique: true
      },
      detections: [DetectionSchema],
      timestamp: {
        type: Date,
        required: true
      }
    },
    { strict: false }
  )
  
module.exports = Message = mongoose.model('messages', MessageSchema)