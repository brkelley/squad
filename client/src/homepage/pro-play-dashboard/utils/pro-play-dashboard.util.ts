import countBy from 'lodash/countBy';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';

import { Prediction } from '../../../types/predictions';
import { TournamentSchedule, ScheduleMatch, ScheduleTeam } from '../../../types/pro-play-metadata';
import { User } from '../../../types/user';

interface FlattenScheduleProps {
    schedule: TournamentSchedule[];
};
export const flattenSchedule = ({ schedule }: FlattenScheduleProps) => {
    return schedule.reduce((matches: ScheduleMatch[], tournamentSchedule) => {
        const schedules = get(tournamentSchedule, 'schedule', []);
        for (let i = 0; i < schedules.length; i++) {
            const currSchedule = schedules[i];
            const tournamentSections = get(currSchedule, 'sections', []);

            for (let j = 0; j < tournamentSections.length; j++) {
                const section = tournamentSections[j];
                const sectionMatches = get(section, 'matches', []);
                matches.push(...sectionMatches);
            }
        }

        return matches;
    }, []);
}

export interface UserTournamentStatistics {
    id: string;
    summonerName: string;
    score: number;
};

interface CalculateScoresByUsersProps {
    predictionMap: {
        [userId: string]: Prediction[];
    };
    schedule: TournamentSchedule[];
    users: User[];
    currentUser: User;
};
export const calculateScoresByUsers = ({
    predictionMap,
    schedule,
    users
}: CalculateScoresByUsersProps) => {
    const flattenedSchedule = flattenSchedule({ schedule });
    const mappedSchedule = keyBy(flattenedSchedule, 'id');
    
    return users.reduce((userStatsArr: any, user) => {
        const predictionsByUser = get(predictionMap, user.id);
        if (!predictionsByUser) return userStatsArr;

        const userStats = {
            id: user.id,
            summonerName: user.summonerName,
            score: 0
        };

        for (let i = 0; i < predictionsByUser.length; i++) {
            const currPrediction = predictionsByUser[i];
            const matchMetadata = get(mappedSchedule, currPrediction.matchId);
            if (!matchMetadata
                || !matchMetadata.strategy
                || ['unstarted', 'inProgress'].includes(matchMetadata.state)
            ) continue;

            const bestOf = matchMetadata.strategy.count;

            const winningTeam = matchMetadata.teams.find((el) => el.result.outcome === 'win');
            if (!winningTeam) continue;

            const winningTeamName = winningTeam.name;

            switch (bestOf) {
                case 1:
                    if (currPrediction.prediction === winningTeamName) {
                        userStats.score++;
                    }
                    break;
                case 5:
                    const actualSeriesResults = matchMetadata.teams.reduce((acc, curr) => {
                        acc[curr.name] = curr.result.gameWins;

                        return acc;
                    }, {});
                    const [ actualSeriesWinner ] = Object.entries(actualSeriesResults)
                        .find(([, score]) => score === 3) || [];

                    const predictedScoreMap = countBy(currPrediction.prediction.split(','), el => el);
                    const predictedResults = matchMetadata.teams.reduce((acc, curr) => ({
                        ...acc,
                        [curr.name]: predictedScoreMap[curr.name] || 0
                    }), {});

                    const [ predictedSeriesWinner ] = Object.entries(predictedResults)
                        .find(([, score]) => score === 3) || [];

                    const hasCorrectWinner = actualSeriesWinner === predictedSeriesWinner;
                    const hasCorrectScore = isEqual(predictedResults, actualSeriesResults);

                    if (hasCorrectWinner) {
                        userStats.score += 3;

                        if (hasCorrectScore) {
                            userStats.score += 2;
                        }
                    }
                    break;
            }
        }

        userStatsArr.push(userStats);

        return userStatsArr;
    }, [])
        .sort((a, b) => b.score - a.score);
};

export interface UserTeamStats {
    mostGuessedTeam: ScheduleTeam;
    mostWonTeam: ScheduleTeam;
    mostIncorrectTeam: ScheduleTeam;
};
export const calculateUserTeamStats = ({ predictionMap, schedule, currentUser, teams }) => {
    const flattenedSchedule = flattenSchedule({ schedule });
    const mappedSchedule = keyBy(flattenedSchedule, 'id');
    const userId = get(currentUser, 'id');
    const userPredictions = Object.values(get(predictionMap, userId, {}));
    const teamMap: { [teamName: string]: { guessed: number, correct: number, incorrect: number } } = {};

    userPredictions.forEach(({ prediction, matchId }) => {
        const scheduleMatch = mappedSchedule[matchId];
        if (!scheduleMatch
            || scheduleMatch.state !== 'completed'
            || !scheduleMatch.strategy
            || scheduleMatch.strategy.count !== 1) return;

        const winningTeam = scheduleMatch.teams.find((el) => el.result.outcome === 'win');
        const losingTeam = scheduleMatch.teams.find((el) => el.result.outcome === 'loss');

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

    return {
        mostGuessedTeam: teams.find((team) => team.name === userStats.guessedTeam),
        mostWonTeam: teams.find((team) => team.name === userStats.correctTeam),
        mostIncorrectTeam: teams.find((team) => team.name === userStats.incorrectTeam)
    };
};
