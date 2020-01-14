const passport = require('passport');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.schema.js');

module.exports.register = (req, res) => {
    var user = new User();

    user.username = req.body.username;
    user.summonerId = req.body.summonerId;

    user.setPassword(req.body.password);

    user.save(function(err) {
        if (err) {
            console.log('save error ', err);
        }
        const token = user.generateJwt();
        res.status(200).json({ token, user });
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

module.exports.validateUserToken = (req, res) => {
    const { _id, username, exp } = jwt.decode(req.body.token);
    const valid = exp < (new Date().getTime() / 1000);
    res.status(200).json({ valid, _id, username, token: req.body.token });
};

module.exports.validate = async (req, res) => {
    const headers = {
        'X-Riot-Token': 'RGAPI-45b394c8-0ac5-42e3-9398-230cc12a637f'
    };
    const { summonerName } = req.query;
    let leagueSummoner, users;
    
    try {
        leagueSummoner = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`, { headers });
    } catch (err) {
        res.status(404).json({ message: 'Invalid summoner name' });
        return;
    }

    try {
        users = await User.find({});
    } catch (err) {
        res.status(500).json({ message: 'database error' });
        return;
    }

    const usernames = users.map(el => el.username);
    if (usernames.includes(summonerName)) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    res.status(200).send(leagueSummoner.data);
};
