const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const db = require('../database/sqlite/sqlite-database.js');

passport.use(new LocalStrategy(
    { usernameField: 'summonerName' },
    async (username, password, done) => {
        try {
            const localUser = await db.retrieveOne('summonerName', username, 'users');
            if (!localUser) {
                return done(null, false, { message: 'User not found '});
            }
            if (!validatePassword(password, localUser)) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, localUser);
        } catch (err) {
            return done(err);
        }
    }
));

const validatePassword = (password, user) => {
    const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
    return user.hash === hash;
};
