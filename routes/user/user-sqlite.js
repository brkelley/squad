const db = require('../../database/sqlite/sqlite-database.js');
const passport = require('passport');
const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

module.exports.register = async (req, res) => {
    const user = { id: uuidv4(), ...req.body };
    user.salt = crypto.randomBytes(16).toString('hex');
    user.hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, 'sha512').toString('hex');
    delete user.password;
    try {
        await db.insert([user], 'users');
        delete user.salt;
        delete user.hash;
        res.status(201).json(user);
        return;
    } catch (error) {
        res.status(400).send({ message: '' + error });
        return;
    }
};

module.exports.login = (req, res, next) => {
    return passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log('ERROR: ', err);
            res.status(404).json(err);
            return;
        }
        if (user) {
            token = generateJwt(user);
            res.status(200).json({ user, token });
        } else {
            res.status(401).json(info);
        }
    })(req, res, next);
};

module.exports.validateSummonerName = async (req, res) => {
    const headers = {
        'X-Riot-Token': 'RGAPI-45b394c8-0ac5-42e3-9398-230cc12a637f'
    };
    const { summonerName } = req.query;
    let leagueSummoner, users;
    
    try {
        leagueSummoner = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`, { headers });
    } catch (err) {
        res.status(404).json({ message: 'invalid summoner name' });
        return;
    }

    try {
        const users = await db.retrieveAll('users');
        const existingSummonerNames = users.map(el => el.summoner_name);
        if (existingSummonerNames.includes(summonerName)) {
            res.status(400).json({ message: 'user already exists' });
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
    res.status(200).send(leagueSummoner.data);
};

module.exports.validateUserToken = (req, res) => {
    const { _id, summonerName, exp } = jwt.decode(req.body.token);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    sevenDaysFromNow.getTime();
    const valid = exp < sevenDaysFromNow / 1000;
    res.status(200).json({ valid, _id, summonerName, token: req.body.token });
};

const generateJwt = user => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    console.log(user);

    return jwt.sign({
        _id: user.id,
        summonerName: user.summoner_name,
        exp: parseInt(expiry.getTime() / 1000)
    }, 'MY_SECRET');
};
