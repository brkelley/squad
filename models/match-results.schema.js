const mongoose = require('mongoose');

const matchResults = new mongoose.Schema({
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
    results: {
        type: Object
    }
});

module.exports = mongoose.model('MatchResults', matchResults, 'matchResults');
