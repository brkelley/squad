const axios = require('axios');
const db = require('../../database/firestore/firestore.js');
const LEAGUES = require('../../constants/leagues.json');
const jwt = require('jsonwebtoken');
const groupBy = require('lodash/groupBy');
const get = require('lodash/get');
const uuidv4 = require('uuid/v4');

const headers = {
    'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z'
};

module.exports.getSchedule = async (req, res) => {
    let scheduleMetadata, userPredictions;
    const { _id } = jwt.decode(req.headers.squadtoken);
    const filters = [
        { key: 'user_id', value: _id }
    ];
    let esportsUrl = 'https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US';
    if (get(req, 'query.leagueId')) {
        esportsUrl += `&leagueId=${req.query.leagueId}`;
        filters.push({ key: 'league_id', value: req.query.leagueId });
    }
    try {
        scheduleMetadata = await axios.get(esportsUrl, { headers });
        userPredictions = await db.retrieveAll('predictions', filters);
        scheduleMetadata = scheduleMetadata.data.data.schedule.events;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Database error' });
        return;
    }
    scheduleMetadata = scheduleMetadata.filter(el => el.state === 'unstarted');
    scheduleMetadata = scheduleMetadata.map(metadata => {
        const prediction = userPredictions.find(el => el.matchId === metadata.match.id);

        if (prediction) {
            metadata.match.prediction = {
                team: prediction.prediction,
                id: prediction.id
            };
        }
        return metadata;
    });
    res.status(200).json(scheduleMetadata);
};

module.exports.saveOrUpdatePrediction = async (req, res) => {
    const predictions = req.body;
    const finalPredictions = [];
    predictions.forEach(async prediction => {
        let returnedPrediction;
        try {
            if (prediction.id) {
                // only want to update the prediction field
                const fields = [{ key: 'prediction', value: prediction.prediction }];
                const comparator = { key: 'id', value: prediction.id };
                returnedPrediction = await db.update(fields, comparator, 'predictions');
            } else {
                returnedPrediction = await db.insert(prediction, 'predictions');
            }
        } catch (error) {
            res.status(400).send({ message: '' + error });
            return;
        }
        finalPredictions.push(returnedPrediction);
    });
    res.status(201).json(finalPredictions);
};
