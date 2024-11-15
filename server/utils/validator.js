const VALIDATION_CONSTANTS = require('../config/constants').VALIDATION_CONSTANTS

module.exports = {
    validateId: validateId,
    validateRssi: validateRssi,
    validateBand: validateBand,
    validateClass: validateClass,
}

function validateId(id) {
    let validLength = id.length == VALIDATION_CONSTANTS.ID_LENGTH
    let validCharacters = true
    for (let char of id) {
        if (!VALIDATION_CONSTANTS.ID_ALLOWED_CHARS.includes(char)) validCharacters = false
    }
    return validLength && validCharacters
}

function validateRssi(rssi) {
    return rssi >= VALIDATION_CONSTANTS.RSSI_MIN_VAL && rssi <= VALIDATION_CONSTANTS.RSSI_MAX_VAL
}

function validateBand(band) {
    return VALIDATION_CONSTANTS.BAND_ALLOWED_VALS.includes(band)
}

function validateClass(classification) {
    return VALIDATION_CONSTANTS.CLASSIFICATION_ALLOWED_VALS.includes(classification)
}