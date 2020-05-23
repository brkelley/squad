import isEmpty from 'lodash/isEmpty';

export const calculateUserSplitStatistics = ({ users, schedule, predictionMap }) => {
    return {
        score: 14,
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
        leaderboard: users.map((user) => ({
            id: user.id,
            name: user.summonerName,
            score: Math.floor(Math.random() * 20) + 1
        })).sort((userA, userB) => userB.score - userA.score)
    };
};
