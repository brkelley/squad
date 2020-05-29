import get from 'lodash/get';
import keyBy from 'lodash/keyBy';

export const calculateUserSplitStatistics = ({ users, schedule, predictionMap }) => {
    const userMap = keyBy(users, 'id');
    console.log('userMap:', userMap);
    console.log('schedule:', schedule);
    console.log('predictionMap:', predictionMap);

    const teamMetadata = {};
    const userScores = {};

    Object.entries(predictionMap).forEach(([leagueId, predictionsByLeague]) => {
        Object.entries(predictionsByLeague).forEach(([userId, predictionsByUser]) => {
            predictionsByUser.forEach((prediction) => {
                const scheduleByLeague = get(schedule, leagueId, []);
                const actualMatchData = scheduleByLeague.find((match) => match.match.id === prediction.matchId);

                if (!actualMatchData) {
                    return;
                }

                const actualMatchWinner = actualMatchData.match.teams.find(el => el.result.outcome === 'win');
                const actualMatchLoser = actualMatchData.match.teams.find(el => el.id !== get(actualMatchWinner, 'id'));

                if (!actualMatchWinner) {
                    return;
                }

                if (!teamMetadata[actualMatchWinner.name]) teamMetadata[actualMatchWinner.name] = teamObj;
                if (!teamMetadata[actualMatchLoser.name]) teamMetadata[actualMatchLoser.name] = teamObj;

                if (!get(userScores, prediction.userId)) {
                    userScores[prediction.userId] = {
                        score: 0
                    };
                }

                if (actualMatchWinner.name === prediction.name) {
                    userScores[prediction.userId].score++;
                }
            });
        });
    });

    const leaderboard = users.map((user) => ({
        id: user.id,
        name: user.summonerName,
        score: 0
    })).sort((userA, userB) => userB.score - userA.score);

    return {
        score: 0,
        placement: 3,
        mostPredicted: {
            name: 'Fnatic',
            abbr: 'FNC',
            image: 'https://lolstatic-a.akamaihd.net/esports-assets/production/team/fnatic-9gbeptb1.png'
        },
        mostWon: {
            name: 'Fnatic',
            abbr: 'FNC',
            image: 'https://lolstatic-a.akamaihd.net/esports-assets/production/team/fnatic-9gbeptb1.png'
        },
        blindspot: {
            name: 'Fnatic',
            abbr: 'FNC',
            image: 'https://lolstatic-a.akamaihd.net/esports-assets/production/team/fnatic-9gbeptb1.png'
        },
        leaderboard
    };
};
