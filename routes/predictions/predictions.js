const db = require('../../database/firestore/firestore.js');
const entries = require('lodash/entries');
const groupBy = require('lodash/groupBy');

module.exports.getAllPredictions = async (req, res) => {
    let userPredictions;

    try {
        userPredictions = await db.retrieveAll('predictions');
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }
    userPredictions = groupBy(userPredictions, 'userId');
    const groupedUserPredictions = {};

    entries(userPredictions).forEach(([key, value]) => {
        groupedUserPredictions[key] = groupBy(value, 'leagueId');
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
        prediction.timestamp = Date.now();
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
