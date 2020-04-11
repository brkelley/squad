const axios = require('axios');
const db = require('../../database/firestore/firestore.js');
const jwt = require('jsonwebtoken');
const get = require('lodash/get');
const groupBy = require('lodash/groupBy');
const entries = require('lodash/entries');
const cache = require('../../cache/cache.js');

const headers = {
    'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z'
};

module.exports.getSchedule = async (req, res) => {
    let scheduleMetadata, userPredictions;
    const { id } = jwt.decode(req.headers.squadtoken);
    const getAllData = req.query.all === 'true';
    const filters = [
        { key: 'userId', value: id }
    ];

    let getScheduleUrl = 'https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US';
    if (get(req, 'query.leagueId')) {
        getScheduleUrl += `&leagueId=${getAllData ? '98767991302996019,98767991299243165' : req.query.leagueId}`;
        filters.push({ key: 'leagueId', value: req.query.leagueId });
    }

    let getCompletedGamesUrl = 'https://esports-api.lolesports.com/persisted/gw/getCompletedEvents?hl=en-US';
    getCompletedGamesUrl += `&tournamentId=${cache.get('currentTournamentIds').join(',')}`;

    try {
        scheduleMetadata = await axios.get(getScheduleUrl, { headers });
        scheduleMetadata = scheduleMetadata.data.data.schedule;
        let newerPageToken = get(scheduleMetadata, 'pages.newer');
        // if the "newer" field is open, take it
        while (newerPageToken) {
            const newerScheduleMetadata = await axios.get(`${getScheduleUrl}&pageToken=${newerPageToken}`, { headers });
            scheduleMetadata.events.push(...get(newerScheduleMetadata.data.data.schedule, 'events', []));
            newerPageToken = newerScheduleMetadata.data.data.schedule.pages.newer;
        }

        scheduleMetadata = scheduleMetadata.events;
        scheduleMetadata = scheduleMetadata.filter(el => ['unstarted', 'inProgress'].includes(el.state));

        const completedGamesData = await axios.get(getCompletedGamesUrl, { headers });
        let completedGames = completedGamesData.data.data.schedule.events;
        completedGames = completedGames.map(el => {
            el.state = 'completed';
            delete el.games;
            return el;
        });

        scheduleMetadata.push(...completedGames);

        userPredictions = await db.retrieveAll('predictions', getAllData ? undefined : filters);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Database error' });
        return;
    }
    scheduleMetadata = scheduleMetadata.map(metadata => {
        let prediction = userPredictions.filter(el => el.matchId === metadata.match.id);
        if (!getAllData) prediction = prediction[0];

        if (prediction && getAllData) {
            if (!metadata.match.prediction) metadata.match.prediction = [];
            metadata.match.prediction = prediction.map(el => ({
                team: el.prediction,
                id: el.id,
                userId: el.userId
            }));
        } else if (prediction) {
            metadata.match.prediction = [{
                team: prediction.prediction,
                id: prediction.id
            }];
        }
        return metadata;
    });
    res.status(200).json(scheduleMetadata);
};

module.exports.getAllPredictions = async (req, res) => {
    let userPredictions;

    try {
        userPredictions = await db.retrieveAll('predictions');
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
    userPredictions = groupBy(userPredictions, 'leagueId');
    const groupedUserPredictions = {};

    entries(userPredictions).forEach(([key, value]) => {
        groupedUserPredictions[key] = groupBy(value, 'userId');
    });

    res.status(200).send(groupedUserPredictions);
};

module.exports.getPredictionsByUser = async (req, res) => {
    let userPredictions;

    try {
        userPredictions = await db.retrieveAll('predictions', [{ key: 'userId', value: req.params.userId }]);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
    res.status(200).send(userPredictions);
};

module.exports.saveOrUpdatePrediction = async (req, res) => {
    const predictions = req.body;
    const finalPredictions = [];
    const currentDate = Date.now();

    if (predictions.matchTime) {
        const matchTimeEpoch = new Date(predictions.matchTime).getTime();
        if (currentDate >= matchTimeEpoch) {
            res.status(400).send({ message: 'match has started!' });
            return;
        }
    }

    for (let i = 0; i < predictions.length; i++) {
        const prediction = predictions[i];
        let returnedPrediction;
        try {
            if (prediction.id) {
                // only want to update the prediction field
                const fields = [{ key: 'prediction', value: prediction.prediction }];
                const comparator = { key: 'id', value: prediction.id };
                await db.update(fields, comparator, 'predictions');
                returnedPrediction = prediction;
            } else {
                returnedPrediction = await db.insert(prediction, 'predictions');
            }
        } catch (error) {
            res.status(400).send({ message: `${error}` });
            return;
        }
        finalPredictions.push(returnedPrediction);
    }
    res.status(201).json(finalPredictions);
};
