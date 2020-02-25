const db = require('../../database/firestore/firestore.js');
const passport = require('passport');
const axios = require('axios');
const crypto = require('crypto');
const toPairs = require('lodash/toPairs');
const cloneDeep = require('lodash/cloneDeep');

module.exports.getUserBySummonerName = async (req, res) => {
    try {
        const user = await db.retrieveOne('summonerName', req.query.summonerName, 'users');
        if (!user) {
            res.status(404).send({ message: 'username not found' });
            return;
        }
        res.status(200).json(user);
        return;
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'database error' });
        return;
    }
};

module.exports.getUsers = async (req, res) => {
    let users;
    try {
        users = await db.retrieveAll('users');
    } catch (error) {
        console.log(error);
    }

    const cleanUsers = users.map(user => {
        delete user.salt;
        delete user.hash;
        return user;
    });
    res.status(200).json(cleanUsers);
};

module.exports.updateUser = async (req, res) => {
    const fieldsToUpdate = cloneDeep(req.body);
    delete fieldsToUpdate.id;
    const fields = toPairs(fieldsToUpdate).map(([key, value]) => ({ key, value }));

    let updatedUser;
    try {
        await db.update(fields, { key: 'id', value: req.params.id }, 'users');
        updatedUser = await db.retrieveOne('id', req.params.id, 'users');
        updatedUser = {
            ...updatedUser,
            ...fieldsToUpdate
        };
    } catch (error) {
        console.error(error);
        res.status(400).message('database error!');
    }

    res.status(201).json(updatedUser);
};

module.exports.syncSummonerName = async (req, res) => {
    const headers = {
        'X-Riot-Token': 'RGAPI-45b394c8-0ac5-42e3-9398-230cc12a637f'
    };

    let leagueSummoner;
    try {
        leagueSummoner = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/${req.body.id}`, { headers });

        // only update summoner name (for now)
        const fields = [{ key: 'summonerName', value: leagueSummoner.data.name }];
        const comparator = { key: 'id', value: req.params.id };

        db.update(fields, comparator, 'users');
        res.status(201).json({ id: req.params.id, summonerName: leagueSummoner.data.name });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: 'invalid summoner ID' });
        return;
    }
};

module.exports.register = async (req, res) => {
    const user = { ...req.body };
    user.salt = crypto.randomBytes(16).toString('hex');
    user.hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, 'sha512').toString('hex');
    delete user.password;
    try {
        const savedUser = await db.insert(user, 'users');
        delete savedUser.salt;
        delete savedUser.hash;
        token = generateJwt(savedUser);
        db.validateUserIntoFirestore(token);
        res.status(201).json({ user: savedUser, token });
        return;
    } catch (error) {
        res.status(400).send({ message: '' + error });
        return;
    }
};

// As of right now, this is hardcoded to resetting password
module.exports.updatePassword = async (req, res) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');
    
    const fields = [{ key: 'salt', value: salt }, { key: 'hash', value: hash }];
    const comparator = { key: 'id', value: req.body.id };
    try {
        await db.update(fields, comparator, 'users');
        const user = await db.retrieveOne('id', req.body.id, 'users');
        token = generateJwt(user);
        res.status(201).json({ user, token });
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
            generateJwt(user).then(token => {
                res.status(200).json({ user, token });
            })
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
    let leagueSummoner;
    
    try {
        leagueSummoner = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`, { headers });
    } catch (err) {
        res.status(404).json({ message: 'invalid summoner name' });
        return;
    }

    try {
        const users = await db.retrieveAll('users');
        const existingSummonerNames = users.map(el => el.summonerName);
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

module.exports.validateUserToken = async (req, res) => {
    if (!req.body.token) {
        res.status(200).json({ valid: false });
        return;
    }
    const { id, summonerName, expiry } = await db.translateJWT(req.body.token);
    if (!summonerName) {
        res.status(200).json({ valid: false });
        return;
    }

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    sevenDaysFromNow.getTime();
    const valid = !!id && expiry < sevenDaysFromNow / 1000;
    if (!valid) {
        res.status(200).json({ valid });
        return;
    }
    const user = await db.retrieveOne('id', id, 'users');
    res.status(200).json({ valid, user, token: req.body.token });
};

const generateJwt = user => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return db.generateJWT(user.id, {
        uid: user.id,
        id: user.id,
        summonerName: user.summonerName,
        expiry: parseInt(expiry.getTime() / 1000)
    });
};
