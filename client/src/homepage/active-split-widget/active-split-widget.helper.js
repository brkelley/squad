import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import toPairs from 'lodash/toPairs';

export const calculateUserSplitStatistics = ({ userId, users, schedule, predictionMap }) => {
    const scheduleByMatchId = toPairs(schedule).reduce((acc, [leagueId, matches]) => {
        acc[leagueId] = groupBy(matches, (obj) => obj.match.id);

        return acc;
    }, {});

    const teamMap = {};

    const allUserStats = users.map((user) => {
        const userPredictionMap = get(predictionMap, user.id, {});

        let userStat = toPairs(userPredictionMap).reduce((stats, [leagueId, leaguePredictions]) => {
            leaguePredictions.forEach((prediction) => {
                const actualMatchResults = get(scheduleByMatchId, `${leagueId}.${prediction.matchId}[0]`, {});

                actualMatchResults.match.teams.forEach((team) => {
                    if (!teamMap[team.name]) {
                        teamMap[team.name] = team;
                    }
                });
                
                if (!actualMatchResults || actualMatchResults.state === 'unstarted') {
                    return stats;
                }

                const winner = actualMatchResults.match.teams.find(el => el.result.outcome === 'win');

                if (!stats.perTeamStats[prediction.prediction]) {
                    stats.perTeamStats[prediction.prediction] = { correct: 0, incorrect: 0 };
                }

                if (winner.name === prediciton.prediction) {
                    stats.correct++;
                    stats.perTeamStats[prediction.prediction].correct++;
                } else {
                    stats.incorrect++;
                    stats.perTeamStats[prediction.prediction].incorrect++;
                }
            });
        }, {
            correct: 0,
            incorrect: 0,
            perTeamStats: {}
        });

        if (!userStat) {
            userStat = { correct: 0, incorrect: 0, perTeamStats: {} }
        }

        const { mostPredicted, mostWon, blindspot } = toPairs(userStat.perTeamStats).reduce((teamAcc, [teamName, teamStat]) => {
            const { correct, incorrect } = teamStat;
            const totalPredicted = correct + incorrect;
            const wonRatio = correct / totalPredicted;
            const blindspotRatio = incorrect / totalPredicted;

            if (teamAcc.mostPredictedRatio < totalPredicted) {
                teamAcc.mostPredictedRatio = totalPredicted;
                teamAcc.mostPredicted = teamName;
            }

            if (teamAcc.mostWonRatio < wonRatio) {
                teamAcc.mostWonRatio = wonRatio;
                teamAcc.mostWon = teamName;
            }

            if (teamAcc.blindspotRatio < blindspotRatio) {
                teamAcc.blindspotRatio = blindspotRatio;
                teamAcc.blindspot = teamName;
            }

            return teamAcc;
        }, {
            mostPredicted: null,
            mostPredictedRatio: -1,
            mostWon: null,
            mostWonRatio: -1,
            blindspot: null,
            blindspotRatio: -1
        });

        return {
            name: user.summonerName,
            id: user.id,
            score: userStat.correct,
            total: userStat.correct + userStat.incorrect,
            mostPredicted: get(teamMap, mostPredicted, null),
            mostWon: get(teamMap, mostWon, null),
            blindspot: get(teamMap, blindspot, null)
        };
    })
        .sort((userA, userB) => userB.score - userA.score);

    const userIndex = allUserStats.findIndex(el => el.id === userId);
    const user = allUserStats[userIndex];

    return {
        score: user.score,
        placement: (userIndex + 1),
        mostPredicted: user.mostPredicted,
        mostWon: user.mostWon,
        blindspot: user.blindspot,
        leaderboard: allUserStats
            .map((el) => ({ id: el.id, name: el.name, score: el.score }))
            .sort((userA, userB) => userB.score = userA.score)
    };
};
