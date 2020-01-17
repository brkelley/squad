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
    // tournament predictions
    // app.get('/tournament/:tournament/:year/predictions', tournamentV2.getTournamentPredictions);

    // // teams endpoints
    // app.get('/teams', teams.getTeamData);
    // app.get('/teams/:name', teams.getTeamByName);

    // // Match metadata endpoints
    // app.get('/tournament/:tournament/:year', tournament.getMatchMetadata);
    // app.post('/tournament/:tournament/:year', tournament.addMatchMetadata);
    // app.put('/tournament/:tournament/:year', tournament.saveMatchMetadata);

    // Pro play metadata endpoints
    app.get('/pro-play/leagues', proPlayMetadata.getLeagues);

    // User Prediction endpoints
    app.get('/predictions', predictions.getSchedule);
    app.post('/predictions', predictions.saveOrUpdatePrediction);
    // app.post('/userPredictions/:tournament/:year/:userId', userPrediction.createUserPrediction);
    // app.get('/userPredictions/:tournament/:year/:userId', userPrediction.getUserPrediction);
    // app.patch('/userPredictions/:tournament/:year/:userId', userPrediction.updateUserPredictions);
    // app.get('/userPredictions/currentStandings/:tournament/:year', userPrediction.getCurrentStandings);

    // // Match result endpoints
    // app.get('/matchResults/:tournament/:year', matchResults.getResults);
    // app.post('/matchResults/:tournament/:year', matchResults.createResults);
    // app.patch('/matchResults/:tournament/:year', matchResults.editResults);

    // user endpoints
    app.get('/user', user.getUserBySummonerName);
    app.post('/user/register', user.register);
    app.post('/user/login', user.login);
    app.patch('/user/updatePassword', user.updatePassword);
    app.get('/user/validateSummonerName', user.validateSummonerName);
    app.post('/user/validateToken', user.validateUserToken);
};
