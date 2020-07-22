const firebase = require('firebase-admin');
const dotenv = require('dotenv');
require('firebase/firestore');
const envs = dotenv.config({ path: '../../../config.env' }).parsed;
const buff = Buffer.from(envs.FIREBASE_CONFIG_SERVICE_ACCOUNT, 'base64');
const text = buff.toString('ascii');
const lodash = require('lodash');
const axios = require('axios');
const headers = {
    'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z'
};

firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(text)),
    databaseURL: 'https://squad-265800.firebaseio.com'
});

const db = firebase.firestore();

const getAllUsers = () => {
    return db.collection('users').get().then((snapshot) => {
        const users = [];
        snapshot.forEach(doc => {
            users.push({
                ...doc.data(),
                id: doc.id
            });
        })
        return users;
    });
}

const calculateScoresByUsers = ({ predictionMap, matchesMap, users }) => {
    return users.reduce((userStatsArr, user) => {
        const predictionsMap = lodash.get(predictionMap, user.id, {});
        const predictionsByUser = Object.values(predictionsMap);
        if (!predictionsByUser) {
            return userStatsArr;
        }

        const userStats = {
            id: user.id,
            summonerName: user.summonerName,
            score: 0
        };

        for (let i = 0; i < predictionsByUser.length; i++) {
            const currPrediction = predictionsByUser[i];
            const matchMetadata = lodash.get(matchesMap, currPrediction.matchId);
            if (!matchMetadata || matchMetadata.type != 'match' || matchMetadata.state != 'completed') {
                continue;
            }

            const bestOf = matchMetadata.match.strategy.count;
            const winningTeam = matchMetadata.match.teams.find((el) => el.result && el.result.outcome === 'win');
            if (!winningTeam) {
                continue;
            }

            const winningTeamName = winningTeam.name;

            if (bestOf === 1) {
                if (currPrediction.prediction === winningTeamName) {
                    userStats.score++;
                }
            } else {
                userStats.score += calculateSeriesScore({ bestOf, matchMetadata, currPrediction });
            }
        }

        userStatsArr.push(userStats);

        return userStatsArr;
    }, [])
        .sort((a, b) => b.score - a.score);
};

const calculateSeriesScore = ({ bestOf, matchMetadata, currPrediction }) => {
    const winningScore = Math.ceil(bestOf / 2);
    const actualSeriesResults = matchMetadata.match.teams.reduce((acc, curr) => {
        acc[curr.name] = curr.result.gameWins;

        return acc;
    }, {});

    const [ actualSeriesWinner ] = Object.entries(actualSeriesResults)
        .find(([, score]) => score === winningScore) || [];

    const predictedScoreMap = lodash.countBy(currPrediction.prediction.split(','), el => el);
    const predictedResults = matchMetadata.match.teams.reduce((acc, curr) => ({
        ...acc,
        [curr.name]: predictedScoreMap[curr.name] || 0
    }), {});

    const [ predictedSeriesWinner ] = Object.entries(predictedResults)
        .find(([, score]) => score === winningScore) || [];

    const hasCorrectWinner = actualSeriesWinner === predictedSeriesWinner;
    const hasCorrectScore = lodash.isEqual(predictedResults, actualSeriesResults);

    let total = 0;
    if (hasCorrectWinner) {
        total += 3;

        if (hasCorrectScore) {
            total += 2;
        }
    }

    return total;
}

const retrieveSchedule = async ({ pageToken = null } = {}) => {
    let { data: schedule } = await axios.get(
        `https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US&leagueId=98767991302996019,98767991299243165&pageToken=${pageToken}`,
        { headers }
    );
    const { older, newer } = schedule.data.schedule.pages;
    schedule = schedule.data.schedule.events;

    return { schedule, olderPageToken: older, newerPageToken: newer };
};

const exportStats = async () => {
    const allPredictions = require('../../firestore/old-data/spring-2021-predictions.json');
    const predictionMap = {};
    for (let prediction of allPredictions) {
        const { matchId, userId } = prediction;
        if (!predictionMap[userId]) {
            predictionMap[userId] = {};
        }
        predictionMap[userId][matchId] = prediction;
    }

    let matchesMap = {};
    let { schedule, olderPageToken } = await retrieveSchedule();
    let mappedSchedule = lodash.keyBy(schedule, 'match.id');
    matchesMap = {
        ...matchesMap,
        ...mappedSchedule
    }
    const x = await retrieveSchedule({ pageToken: olderPageToken });
    olderPageToken = x.olderPageToken;
    schedule = x.schedule;
    mappedSchedule = lodash.keyBy(schedule, 'match.id');
    matchesMap = {
        ...matchesMap,
        ...mappedSchedule
    }
    const y = await retrieveSchedule({ pageToken: olderPageToken });
    olderPageToken = y.olderPageToken;
    schedule = y.schedule;
    mappedSchedule = lodash.keyBy(schedule, 'match.id');
    matchesMap = {
        ...matchesMap,
        ...mappedSchedule
    }
    const z = await retrieveSchedule({ pageToken: olderPageToken });
    olderPageToken = z.olderPageToken;
    schedule = z.schedule;
    mappedSchedule = lodash.keyBy(schedule, 'match.id');
    matchesMap = {
        ...matchesMap,
        ...mappedSchedule
    }
    
    const users = await getAllUsers();
    
    const stats = await calculateScoresByUsers({ predictionMap, matchesMap, users });
    stats.forEach((stat) => {
        db
            .collection('users')
            .doc(stat.id)
            .set({
                splitStats: {
                    spring2021: {
                        score: stat.score
                    }
                }
            }, { merge: true });
    });
}
exportStats();
