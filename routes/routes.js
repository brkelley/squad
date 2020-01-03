const passport = require('passport');
const user = require('./user/user-sqlite.js');

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

    // // User Prediction endpoints
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
