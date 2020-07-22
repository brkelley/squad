
import { Prediction } from '../../../types/predictions';
import { MatchMetadata, Team } from '../../../types/pro-play-metadata';
import { User } from '../../../types/user';import countBy from 'lodash/countBy';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

export interface UserTournamentStatistics {
    id: string;
    summonerName: string;
    score: number;
};

interface CalculateScoresByUsersProps {
    predictionMap: {
        [userId: string]: {
            [matchId: string]: Prediction
        }
    }
    matchesMap: {
        [matchId: string]: MatchMetadata
    }
    users: User[]
}
export const calculateScoresByUsers = ({
    predictionMap,
    matchesMap,
    users
}: CalculateScoresByUsersProps) => {
    return users.reduce((userStatsArr: any, user) => {
        const predictionsMap = get(predictionMap, user.id, {});
        const predictionsByUser: Prediction[] = Object.values(predictionsMap);
        if (!predictionsByUser) {
            return userStatsArr;
        }

        const userStats = {
            id: user.id,
            summonerName: user.summonerName,
            score: 0
        };

        for (let i = 0; i < predictionsByUser.length; i++) {
            const currPrediction: Prediction = predictionsByUser[i];
            const matchMetadata: MatchMetadata = get(matchesMap, currPrediction.matchId);
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

const calculateSeriesScore = ({ bestOf, matchMetadata, currPrediction }): number => {
    const winningScore = Math.ceil(bestOf / 2);
    const actualSeriesResults = matchMetadata.match.teams.reduce((acc, curr) => {
        acc[curr.name] = curr.result.gameWins;

        return acc;
    }, {});

    const [ actualSeriesWinner ] = Object.entries(actualSeriesResults)
        .find(([, score]) => score === winningScore) || [];

    const predictedScoreMap = countBy(currPrediction.prediction.split(','), el => el);
    const predictedResults = matchMetadata.match.teams.reduce((acc, curr) => ({
        ...acc,
        [curr.name]: predictedScoreMap[curr.name] || 0
    }), {});

    const [ predictedSeriesWinner ] = Object.entries(predictedResults)
        .find(([, score]) => score === winningScore) || [];

    const hasCorrectWinner = actualSeriesWinner === predictedSeriesWinner;
    const hasCorrectScore = isEqual(predictedResults, actualSeriesResults);

    let total = 0;
    if (hasCorrectWinner) {
        total += 3;

        if (hasCorrectScore) {
            total += 2;
        }
    }

    return total;
}

export interface UserTeamStats {
    mostGuessedTeam: Team | null
    mostWonTeam: Team | null
    mostIncorrectTeam: Team | null
};
interface UserTeamStatsProps {
    predictionMap: {
        [userId: string]: {
            [matchId: string]: Prediction
        }
    }
    matchesMap: {
        [matchId: string]: MatchMetadata
    }
    currentUser: User
    teams: Team[]
}
export const calculateUserTeamStats = ({
    predictionMap,
    matchesMap,
    currentUser,
    teams
}: UserTeamStatsProps): UserTeamStats => {
    const userId = get(currentUser, 'id');
    const userPredictions: Prediction[] = Object.values(get(predictionMap, userId, {}));
    const teamMap: { [teamName: string]: { guessed: number, correct: number, incorrect: number } } = {};

    userPredictions.forEach(({ prediction, matchId }) => {
        const scheduleMatch: MatchMetadata = matchesMap[matchId];
        if (!scheduleMatch
            || scheduleMatch.state !== 'completed'
            || !scheduleMatch.match.strategy
            || scheduleMatch.match.strategy.count !== 1) return;

        const winningTeam = scheduleMatch.match.teams.find((el) => el.result && el.result.outcome === 'win');
        const losingTeam = scheduleMatch.match.teams.find((el) => el.result && el.result.outcome === 'loss');

        if (!winningTeam || !losingTeam) return;

        if (!teamMap[prediction]) {
            teamMap[prediction] = { guessed: 0, correct: 0, incorrect: 0 };
        }

        teamMap[prediction].guessed++;

        if (winningTeam.name === prediction) {
            teamMap[prediction].correct++;
        } else {
            teamMap[prediction].incorrect++;
        }
    });

    const userStats = Object.entries(teamMap).reduce((acc, [teamName, stats]) => {
        const { guessed, correct, incorrect } = stats;
        
        return {
            guessedTeam: acc.guessedIter < guessed ? teamName : acc.guessedTeam,
            guessedIter: acc.guessedIter < guessed ? guessed : acc.guessedIter,
            correctTeam: acc.correctIter < correct ? teamName : acc.correctTeam,
            correctIter: acc.correctIter < correct ? correct : acc.correctIter,
            incorrectTeam: acc.incorrectIter < incorrect ? teamName : acc.incorrectTeam,
            incorrectIter: acc.incorrectIter < incorrect ? incorrect : acc.incorrectIter
        }
    }, {
        guessedTeam: null,
        guessedIter: 0,
        correctTeam: null,
        correctIter: 0,
        incorrectTeam: null,
        incorrectIter: 0
    });
    const TBDTeam: Team = {
        code: 'TBD',
        image: 'https://lolstatic-a.akamaihd.net/esports-assets/production/team/tbd-awibzy0k.png',
        name: 'TBD',
        id: '100205572995797818',
        slug: 'tbd',
        alternativeImage: 'https://lolstatic-a.akamaihd.net/esports-assets/production/team/tbd-frpypqn6.png'
      }

    const mostGuessedTeam = teams.find((team) => team.name === userStats.guessedTeam) || TBDTeam;
    const mostWonTeam = teams.find((team) => team.name === userStats.correctTeam) || TBDTeam;
    const mostIncorrectTeam = teams.find((team) => team.name === userStats.incorrectTeam) || TBDTeam;

    return {
        mostGuessedTeam,
        mostWonTeam,
        mostIncorrectTeam
    };
};
