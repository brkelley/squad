const mongoose = require('mongoose');

const userPredictionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    tournament: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        required: true
    },
    round: {
        type: String,
        required: true
    },
    predictions: {
        type: Object
    }
});

module.exports = mongoose.model('UserPrediction', userPredictionSchema, 'userPredictions');
