import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
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
                    return;
                }

                const actualMatchResults = get(scheduleByMatchId, `${leagueId}.${prediction.matchId}[0]`, {});

                // add team to team map (so we can pull the metadata later)
                actualMatchResults.match.teams.forEach((team) => {
                    if (!teamMap[team.name]) {
                        teamMap[team.name] = team;
                    }
                });
                
                if (!actualMatchResults || actualMatchResults.state !== 'completed') {
                    continue;
                }

                // this is because the API actually calls unstarted & completed games separately
                // lol honestly IDK why I should check that out
                const winner = actualMatchResults.match.teams.find(el => el.result.gameWins === 1);

                // when a game immediately ends, sometimes the state is "completed" but no winner is marked
                if (!winner) return stats;

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
            }

            return stats;
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
            .sort((userA, userB) => userB.score - userA.score)
    };
};
