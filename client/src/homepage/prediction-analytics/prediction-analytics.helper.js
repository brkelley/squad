import flatMap from 'lodash/flatMap';
import keyBy from 'lodash/keyBy';

const calculateMostWins = predictedTeamTotals => {
    let mostWins = { winLoss: { win: -1 } };
    Object.values(predictedTeamTotals).forEach(team => {
        if (mostWins.winLoss.win < team.winLoss.win) {
            mostWins = team;
        }
    });
    return mostWins;
};

const calculateMostLosses = predictedTeamTotals => {
    let mostLosses = { winLoss: { loss: -1 } };
    Object.values(predictedTeamTotals).forEach(team => {
        if (mostLosses.winLoss.loss < team.winLoss.loss) {
            mostLosses = team;
        }
    });
    return mostLosses;
};

const calculateMostPredicted = predictedTeamTotals => {
    let mostPredicted = { count: -1 };

    Object.values(predictedTeamTotals).forEach(team => {
        if (mostPredicted.count < team.count) {
            mostPredicted = team;
        }
    });

    return mostPredicted;
};

const calculateScores = ({ users, schedule, predictionMap, userId }) => {
    const totalsByUser = {};

    users.forEach(user => {
        totalsByUser[user.id] = {
            id: user.id,
            name: user.summonerName,
            score: 0,
            mostPredicted: {}
        };

        const userPredictionsAsArray = flatMap(Object.values(predictionMap).map(el => el[user.id]));
        const userPredictions = keyBy(userPredictionsAsArray, 'matchId');
        const completedGames = flatMap(Object.values(schedule)).filter(el => el.state === 'completed');

        completedGames.forEach(game => {
            if (!game.blockName.includes('Week ')) return;
            const associatedPrediction = userPredictions[game.match.id];
            if (!associatedPrediction) return;

            if (associatedPrediction.prediction === 'Hundred Thieves') {
                associatedPrediction.prediction = '100 Thieves';
            }

            const predictedGame = game.match.teams.find(el => el.name === associatedPrediction.prediction);

            if (!totalsByUser[user.id].mostPredicted[predictedGame.name]) {
                totalsByUser[user.id].mostPredicted[predictedGame.name] = {
                    count: 1,
                    teamMetadata: predictedGame,
                    winLoss: { win: 0, loss: 0 }
                };
            } else {
                totalsByUser[user.id].mostPredicted[predictedGame.name].count++;
            }

            const gameWinner = game.match.teams.find(el => el.result.gameWins === 1);

            if (gameWinner.name === associatedPrediction.prediction) {
                totalsByUser[user.id].score++;
                totalsByUser[user.id].mostPredicted[predictedGame.name].winLoss.win++;
            } else {
                totalsByUser[user.id].mostPredicted[predictedGame.name].winLoss.loss++;
            }
        });
    });

    const sortedTotals = Object.values(totalsByUser)
        .map(el => ({ id: el.id, name: el.name, score: el.score }))
        .sort((val1, val2) => val2.score - val1.score);

    return {
        leaderboard: sortedTotals,
        mostPredicted: calculateMostPredicted(totalsByUser[userId].mostPredicted),
        mostWins: calculateMostWins(totalsByUser[userId].mostPredicted),
        mostLosses: calculateMostLosses(totalsByUser[userId].mostPredicted)
    };
};

export default calculateScores;
