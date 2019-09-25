const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../../models/user.js');

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
}
