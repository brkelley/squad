const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    abbreviation: {
        type: String,
        unique: true,
        required: true
    },
    logo: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('Team', teamSchema, 'teams');
