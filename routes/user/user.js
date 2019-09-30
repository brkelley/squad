const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../../models/user.schema.js');

module.exports.register = function (req, res) {
    var user = new User();

    user.name = req.body.name;
    user.username = req.body.username;
    user.summonerId = req.body.summonerId;

    user.setPassword(req.body.password);

    user.save(function(err) {
        if (err) {
            console.log('save error ', err);
        }
        const token = user.generateJwt();
        res.status(200).json({ token });
    });
};

module.exports.login = (req, res, next) => {
    return passport.authenticate('local', (err, user, info) => {
        if (err) {
            res.status(404).json(err);
            return;
        }
        if (user) {
            token = user.generateJwt();
            res.status(200).json({
                user,
                token
            });
        } else {
            res.status(401).json(info);
        }
    })(req, res, next);
};
