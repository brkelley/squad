import countBy from 'lodash/countBy';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import isEqual from 'lodash/isEqual';
import toPairs from 'lodash/toPairs';

export const calculateUserSplitStatistics = ({ userId, users, schedule, predictionMap }) => {
    const scheduleByMatchId = toPairs(schedule).reduce((acc, [leagueId, matches]) => {
        // filter is because sometimes the match object isn't on the metadata?
        acc[leagueId] = groupBy(matches.filter(el => el.match), (obj) => obj.match.id);

        return acc;
    }, {});

    const teamMap = {};

    const allUserStats = users.map((user) => {
        const userPredictionMap = get(predictionMap, user.id, {});

        let userStat = toPairs(userPredictionMap).reduce((stats, [leagueId, leaguePredictions]) => {
            for (let i = 0; i < leaguePredictions.length; i++) {
                const prediction = leaguePredictions[i];

                if (!prediction) {
                    continue;
                }

                const actualMatchResults = get(scheduleByMatchId, `${leagueId}.${prediction.matchId}[0]`, {});

                if (!actualMatchResults || !actualMatchResults.match) {
                    continue;
                }

                // add team to team map (so we can pull the metadata later)
                actualMatchResults.match.teams.forEach((team) => {
                    if (!teamMap[team.name]) {
                        teamMap[team.name] = team;
                    }
                });
                
                if (!actualMatchResults || actualMatchResults.state !== 'completed') {
                    continue;
                }
                const bestOfCount = get(actualMatchResults, 'match.strategy.count', -1);

                switch (bestOfCount) {
                    case 1:
                        const winner = actualMatchResults.match.teams.find(el => el.result.gameWins === 1);

                        // when a game immediately ends, sometimes the state is "completed" but no winner is marked
                        if (!winner) continue;
        
                        if (!stats.perTeamStats[prediction.prediction]) {
                            stats.perTeamStats[prediction.prediction] = { correct: 0, incorrect: 0 };
                        }
        
                        if (winner.name === prediction.prediction) {
                            stats.correct++;
                            stats.perTeamStats[prediction.prediction].correct++;
                        } else {
                            stats.incorrect++;
                            stats.perTeamStats[prediction.prediction].incorrect++;
                        }
                        break;
                    case 5:
                        if (!stats.seriesStats) {
                            stats.seriesStats = {
                                scoreMap: {},
                                points: 0
                            };
                        }
                        const seriesPredictionByTeam = countBy(prediction.prediction.split(','), (teamName) => teamName);
                        const seriesPredictionWinner = Object.entries(seriesPredictionByTeam).find(([_, score]) => score === 3)[0];

                        if (Object.keys(seriesPredictionByTeam).length === 1) {
                            const missingTeam = actualMatchResults.match.teams.find((el) => Object.keys(seriesPredictionByTeam)[0] !== el.name);
                            seriesPredictionByTeam[missingTeam.name] = 0;
                        }

                        const seriesKey = Object.values(seriesPredictionByTeam).sort((a, b) => b - a).join('-');
                        if (!stats.seriesStats.scoreMap[seriesKey]) {
                            stats.seriesStats.scoreMap[seriesKey] = 0;
                        }
                        stats.seriesStats.scoreMap[seriesKey]++;

                        const actualSeriesResults = actualMatchResults.match.teams.reduce((acc, team) => ({ ...acc, [team.name]: team.result.gameWins}), {});
                        const actualSeriesWinner = actualMatchResults.match.teams.find((team) => team.result.gameWins === 3).name;

                        if (seriesPredictionWinner === actualSeriesWinner) {
                            stats.seriesStats.points += 3;

                            if (isEqual(actualSeriesResults, seriesPredictionByTeam)) {
                                stats.seriesStats.points += 2;
                            }
                        }

                        break;
                    default:
                        continue;
                }
                
            }

            return stats;
        }, {
            correct: 0,
            incorrect: 0,
            perTeamStats: {},
            seriesStats: {
                scoreMap: {},
                points: 0
            }
        });

        if (!userStat) {
            userStat = { correct: 0, incorrect: 0, perTeamStats: {} }
        }

        const { mostPredicted, mostWon, blindspot } = toPairs(userStat.perTeamStats).reduce((teamAcc, [teamName, teamStat]) => {
            const { correct, incorrect } = teamStat;
            const totalPredicted = correct + incorrect;

            if (teamAcc.mostPredictedNum < totalPredicted) {
                teamAcc.mostPredictedNum = totalPredicted;
                teamAcc.mostPredicted = teamName;
            }

            if (teamAcc.mostWonNum < correct) {
                teamAcc.mostWonNum = correct;
                teamAcc.mostWon = teamName;
            }

            if (teamAcc.blindspotNum < incorrect) {
                teamAcc.blindspotNum = incorrect;
                teamAcc.blindspot = teamName;
            }

            return teamAcc;
        }, {
            mostPredicted: null,
            mostPredictedNum: -1,
            mostWon: null,
            mostWonNum: -1,
            blindspot: null,
            blindspotNum: -1
        });

        return {
            name: user.summonerName,
            id: user.id,
            score: userStat.correct + userStat.seriesStats.points,
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
            .sort((userA, userB) => userB.score - userA.score)
    };
};
