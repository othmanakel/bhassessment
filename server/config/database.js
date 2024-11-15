let MONGO_URI = require('./constants').MONGO_URI

module.exports = function (mongoose, logger, isTest) {
    if (isTest) MONGO_URI = require('./constants').MONGO_TEST_URI
    mongoose.connect(MONGO_URI)
      .then(logger.info('DB connected: ' + MONGO_URI))
      .catch(err => logger.error(err))
  }