const MONGO_URI = 'mongodb+srv://othmanakel112:ungaunga97@bhcluster.nt6iq.mongodb.net/bhassessment?retryWrites=true&w=majority&appName=BHCluster'
const MONGO_TEST_URI = 'mongodb+srv://othmanakel112:ungaunga97@bhcluster.nt6iq.mongodb.net/bhassessmenttest?retryWrites=true&w=majority&appName=BHCluster'

const VALIDATION_CONSTANTS = {
    ID_LENGTH : 8,
    ID_ALLOWED_CHARS : 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
    RSSI_MIN_VAL: -110,
    RSSI_MAX_VAL: -65,
    BAND_ALLOWED_VALS: ['2.4GHz', '5.8GHz'],
    CLASSIFICATION_ALLOWED_VALS: ['OcuSync', 'Lightbridge']
}
const BAND_CONSTANTS = {
    BAND_TWO: '2.4GHz',
    BAND_FIVE: '5.8GHz',
}

const CLASSIFICATION_CONSTANTS = {
    CLASSIFICATION_OCU: 'OcuSync',
    CLASSIFICATION_LIGHT: 'Lightbridge',
}

module.exports = { MONGO_URI, MONGO_TEST_URI, VALIDATION_CONSTANTS, BAND_CONSTANTS, CLASSIFICATION_CONSTANTS }