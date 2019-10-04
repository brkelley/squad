const passport = require('passport');
const user = require('./user/user.js');
const predictionsMatches = require('./predictions/predictions-matches.js');

const jwt = require('express-jwt');
const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

module.exports = function (app) {

    app.get('/matches', predictionsMatches.matches);

    // user endpoints
    app.post('/user/register', user.register);
    app.post('/user/login', user.login);
    app.get('/user/validate', user.validate);
};
