const passport = require('passport');
const proPlayMetadata = require('./pro-play-metadata/pro-play-metadata.js');
const user = require('./user/user.js');
const predictions = require('./predictions/predictions.js');

const jwt = require('express-jwt');
const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

module.exports = function (app) {
    // Pro play metadata endpoints
    app.get('/pro-play/leagues', proPlayMetadata.getLeagues);
    app.get('/pro-play/schedule', proPlayMetadata.getSchedule);

    // User Prediction endpoints
    app.get('/predictions', predictions.getAllPredictions);
    app.post('/predictions', predictions.saveOrUpdatePrediction);
    app.get('/predictions/:userId', predictions.getPredictionsByUser);

    // user endpoints
    app.get('/user', user.getUserBySummonerName);
    app.get('/users', user.getUsers);
    app.post('/user/register', user.register);
    app.post('/user/login', user.login);
    app.patch('/user/updatePassword', user.updatePassword);
    app.get('/user/validateSummonerName', user.validateSummonerName);
    app.post('/user/validateToken', user.validateUserToken);
};
