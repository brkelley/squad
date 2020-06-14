const firebase = require('firebase-admin');
const dotenv = require('dotenv');
require('firebase/firestore');
const _ = require('lodash');
const fs = require('fs');
const axios = require('axios');
const headers = {
    'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z'
};

const envs = dotenv.config({ path: '../../config.env' }).parsed;
const buff = Buffer.from(envs.FIREBASE_CONFIG_SERVICE_ACCOUNT, 'base64');
const text = buff.toString('ascii');

firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(text)),
    databaseURL: 'https://squad-265800.firebaseio.com'
});

const db = firebase.firestore();

const predictions = [];
const predictionMap = {};
const duplicatePredictions = {};

db.collection('predictions').get().then((snapshot) => {
    snapshot.forEach(doc => {
        predictions.push({
            ...doc.data(),
            id: doc.id
        });
    })
})
.then(() => {
    Object.entries(_.groupBy(predictions, 'userId'))
        .forEach(([userId, predictions]) => {
            console.log(userId, predictions.length);
        })
    // predictions
    //     .filter(el => el.userId === 'YUfP0x1C913WIdkaEtYR')
    //     .forEach((prediction) => {
    //         if (!predictionMap[prediction.matchId]) {
    //             predictionMap[prediction.matchId] = [prediction];
    //         } else {
    //             predictionMap[prediction.matchId].push(prediction);
    //             duplicatePredictions[prediction.matchId] = predictionMap[prediction.matchId];
    //         }
    //         Object.values(duplicatePredictions).forEach((duplicates) => {
    //             if (duplicates.length > 1) {
    //                 const dupe = duplicates.sort((a, b) => a.timestamp - b.timestamp)[0];
    //                 db.collection('predictions').doc(dupe.id).delete();
    //             }
    //         });
    //     });
})

// db.collection('predictions').get().then(snapshot => {
//     snapshot.forEach(doc => {
//         predictions.push(doc.data());
//     });

//     try {
//         fs.writeFileSync('./old-data/spring-2020-predictions.json', JSON.stringify(predictions));
//     } catch (err) {
//         console.error(err);
//     }
// });

const retrieveSchedule = async ({ pageToken = null }) => {
    let { data: schedule } = await axios.get(
        `https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US&leagueId=98767991302996019,98767991299243165&pageToken=${pageToken}`,
        { headers }
    );
    const { older, newer } = schedule.data.schedule.pages;
    schedule = schedule.data.schedule.events;

    return { schedule, olderPageToken: older, newerPageToken: newer };
};

const getEndOfSplitAnalytics = async () => {
    const teamInfo = {};
    const userStatsMap = {};
    const splitData = require('../firestore/old-data/spring-2020-predictions.json');

    let { schedule, olderPageToken } = await retrieveSchedule({ pageToken: null });

    const numPredictions = splitData.length;
    for (let i = 0; i < numPredictions; i++) {
        const predictedEvent = splitData.pop();
        const { userId } = predictedEvent;
        const predictedEventId = lodash.get(predictedEvent, 'matchId');
        let actualEvent = schedule.find(el => lodash.get(el, 'match.id') === predictedEventId);
        
        while (!actualEvent) {
            const updatedData = await retrieveSchedule({ pageToken: olderPageToken });
            schedule.push(...updatedData.schedule);
            olderPageToken = updatedData.olderPageToken;
            actualEvent = schedule.find(el => lodash.get(el, 'match.id') === predictedEventId);
        }

        const actualEventWinner = actualEvent.match.teams.find(el => el.result.outcome === 'win');
        const actualEventLoser = actualEvent.match.teams.find(el => el.result.outcome !== 'win');

        if (!teamInfo[actualEventWinner.name]) {
            teamInfo[actualEventWinner.name] = lodash.cloneDeep(actualEventWinner);
            delete teamInfo[actualEventWinner.name].result;
            delete teamInfo[actualEventWinner.name].record;
        }
        if (!teamInfo[actualEventLoser.name]) {
            teamInfo[actualEventLoser.name] = lodash.cloneDeep(actualEventLoser);
            delete teamInfo[actualEventLoser.name].result;
            delete teamInfo[actualEventLoser.name].record;
        }

        // build object
        if (!userStatsMap[userId]) {
            userStatsMap[userId] = {
                perTeamStats: {},
                seriesStats: {
                    correctWinners: 0,
                    correctScores: 0,
                    scoreGuessBreakdowns: {
                        '3-0': 0,
                        '3-1': 0,
                        '3-2': 0
                    }
                }
            };
        }

        if (actualEvent.match.strategy.count === 1) {
            if (!userStatsMap[userId].perTeamStats[predictedEvent.prediction]) {
                userStatsMap[userId].perTeamStats[predictedEvent.prediction] = {
                    right: 0,
                    wrong: 0
                };
            }

            if (actualEventWinner.name === predictedEvent.prediction) {
                userStatsMap[userId].perTeamStats[predictedEvent.prediction].right++;
            } else {
                userStatsMap[userId].perTeamStats[predictedEvent.prediction].wrong++;
            }
        } else if (actualEvent.match.strategy.count === 5) {
            const predictedSeriesResults = lodash
                .chain(predictedEvent.prediction)
                .split(',')
                .reduce((acc, prediction) => {
                    if (!acc[prediction]) {
                        acc[prediction] = 1;
                    } else {
                        acc[prediction]++;
                    }

                    return acc;
                }, {})
                .toPairs()
                .map(([teamName, score]) => ({ teamName, score }))
                .value();

            let actualSeriesResults = {
                [actualEventWinner.name]: actualEventWinner.result.gameWins,
                [actualEventLoser.name]: actualEventLoser.result.gameWins
            };
            actualSeriesResults = lodash
                .toPairs(actualSeriesResults)
                .map(([teamName, score]) => ({ teamName, score }));

            const predictedSeriesWinner = predictedSeriesResults.find(el => el.score === 3);
            const predictedSeriesLoser = predictedSeriesResults.find(el => el.teamName !== predictedSeriesWinner.teamName);
            const actualSeriesWinner = actualSeriesResults.find(el => el.score === 3);
            const actualSeriesLoser = actualSeriesResults.find(el => el.teamName !== actualSeriesWinner.teamName);

            const correctPrediction = predictedSeriesWinner.teamName === actualSeriesWinner.teamName;
            
            if (correctPrediction) {
                userStatsMap[userId].seriesStats.correctWinners++;
            }
            if (correctPrediction && lodash.get(predictedSeriesLoser, 'score', 0) === lodash.get(actualSeriesLoser, 'score', 0)) {
                userStatsMap[userId].seriesStats.correctScores++;
            }
            const predictedScore = `3-${lodash.get(predictedSeriesLoser, 'score', 0)}`;
            userStatsMap[userId].seriesStats.scoreGuessBreakdowns[predictedScore]++;
        }
    }

    const userArray = [];
    const snapshot = await db.collection('users').get();
    snapshot.forEach((doc) => {
        userArray.push({
            ...doc.data(),
            id: doc.id
        });
    });

    userArray.forEach((user) => {
        const userStats = userStatsMap[user.id];
        userStats.score = 0;
        userStats.mostCorrectTeam = null;
        userStats.mostCorrectNum = -1;
        userStats.mostGuessedTeam = null;
        userStats.mostGuessedNum = -1;
        userStats.blindspotTeam = null;
        userStats.blindspotNum = -1;

        lodash.toPairs(userStats.perTeamStats).forEach(([teamName, teamStats]) => {
            userStats.score += teamStats.right;
            const guessed = teamStats.right + teamStats.wrong;
            const rightRatio = teamStats.right / guessed;
            const wrongRatio = teamStats.wrong / guessed;

            if (guessed >= 5) {
                if (rightRatio > userStats.mostCorrectNum) {
                    userStats.mostCorrectNum = rightRatio;
                    userStats.mostCorrectTeam = teamInfo[teamName];
                }
                if (guessed > userStats.mostGuessedNum) {
                    userStats.mostGuessedNum = guessed;
                    userStats.mostGuessedTeam = teamInfo[teamName];
                }
                if (wrongRatio > userStats.blindspotNum) {
                    userStats.blindspotNum = wrongRatio;
                    userStats.blindspotTeam = teamInfo[teamName];
                }
            }
        });

        userStats.score += ((userStats.seriesStats.correctWinners * 3) + (userStats.seriesStats.correctScores * 2));
    });

    const sortedUserStats = lodash
        .chain(userStatsMap)
        .toPairs()
        .sort((a, b) => (b[1].score - a[1].score))
        .map(([userId, stats], index) => ({
            userId,
            summonerName: userArray.find(el => el.id === userId).summonerName,
            stats: {
                score: stats.score,
                blindspot: stats.blindspotTeam,
                mostPredicted: stats.mostGuessedTeam,
                mostWon: stats.mostCorrectTeam,
                placement: index + 1,
                mostGuessedSeriesScore: lodash
                    .toPairs(stats.seriesStats.scoreGuessBreakdowns)
                    .reduce((highest, [score, num]) => {
                        return num > highest.num ? { score, num } : highest;
                    }, { num: 0 }).score
            }
        }))
        .value();

    sortedUserStats.forEach((userStats) => {
        db
            .collection('users')
            .doc(userStats.userId)
            .set({
                splitStats: {
                    spring2020: userStats.stats
                }
            }, { merge: true });
    });
};
// getEndOfSplitAnalytics();
