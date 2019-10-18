const mongoose = require('mongoose');

const matchMetadataSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true
    },
    tournament: {
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
    bestOf: {
        type: Number,
        required: true
    },
    matches: {
        type: Array
    }
});

module.exports = mongoose.model('MatchMetadata', matchMetadataSchema, 'tournamentMetadata');
