const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user.js');

passport.use(new LocalStrategy(
    { username: 'username' },
    function (username, password, done) {
        User.findOne({ username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            if (!user.validatePassword(password)) {
                return (done, false, { message: 'Incorrect password' });
            }

            return done(null, user);
        })
    }
));
