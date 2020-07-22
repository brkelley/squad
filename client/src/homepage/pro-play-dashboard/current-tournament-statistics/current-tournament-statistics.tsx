import './current-tournament-statistics.scss';
import React, { useState, useEffect } from 'react';
import {
    calculateScoresByUsers,
    calculateUserTeamStats,
    UserTournamentStatistics,
    UserTeamStats
} from '../utils/pro-play-dashboard.util';
import { convertNumberToCardinal } from '../../../utils/common.util';
import { Prediction } from '../../../types/predictions';
import { MatchMetadata, Team } from '../../../types/pro-play-metadata';
import { User } from '../../../types/user';
import isEmpty from 'lodash/isEmpty';
import keyBy from 'lodash/keyBy';
import some from 'lodash/some';

interface CurrentTournamentStatisticsProps {
    predictionMap: {
        [userId: string]: {
            [matchId: string]: Prediction
        }
    }
    matches: MatchMetadata[]
    currentUser: User
    users: User[]
    teams: Team[]
};
export default ({
    predictionMap,
    matches,
    currentUser,
    users,
    teams
}: CurrentTournamentStatisticsProps) => {
    const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
    const [scoreboard, setScoreboard] = useState<UserTournamentStatistics[]>([]);
    const [userTeamStats, setUserTeamStats] = useState<UserTeamStats>();

    useEffect(() => {
        if (!isEmpty(matches) && !isEmpty(users) && !isEmpty(teams)) {
            const matchesMap = keyBy(matches, 'match.id')
            setScoreboard(calculateScoresByUsers({ predictionMap, matchesMap, users }));
            setUserTeamStats(calculateUserTeamStats({ predictionMap, matchesMap, currentUser, teams }));
            setShowScoreboard(true);
        }
    }, [predictionMap, matches, users, teams]);

    const renderScoreAndPlacing = () => {
        const activeUserPlacing = scoreboard.findIndex((el) => el.id === currentUser.id);

        return (
            <div className="score-and-placing">
                {convertNumberToCardinal(activeUserPlacing + 1)} place
            </div>
        );
    };

    const renderUserTeamStats = () => {
        if (!userTeamStats || some(Object.values(userTeamStats), (el) => !el)) return '';

        const { mostGuessedTeam, mostWonTeam, mostIncorrectTeam } = userTeamStats;

        return (
            <div className="user-team-stats">
                {
                    mostGuessedTeam && (
                        <div className="team-stat">
                            <img
                                className="team-stat-image"
                                src={mostGuessedTeam.image} />
                            <div className="team-stat-label">
                                most predicted
                            </div>
                        </div>
                    )
                }
                {
                    mostWonTeam && (
                        <div className="team-stat">
                            <img
                                className="team-stat-image"
                                src={mostWonTeam.image} />
                            <div className="team-stat-label">
                                most won
                            </div>
                        </div>
                    )
                }
                {
                    mostIncorrectTeam && (
                        <div className="team-stat">
                            <img
                                className="team-stat-image"
                                src={mostIncorrectTeam.image} />
                            <div className="team-stat-label">
                                blindspot
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }

    const renderScoreboard = () => {
        if (!showScoreboard || !scoreboard || scoreboard.length === 0) return '';

        return (
            <div className="current-tournament-scoreboard">
                <table className="tournament-table">
                    <tbody>
                        {
                            scoreboard.map(({ id, summonerName, score}, index) => {
                                const activeUserClass = id === currentUser.id ? 'active-user-row' : '';
                                return (
                                    <tr
                                        className={`scoreboard-row ${activeUserClass}`}
                                        key={id}>
                                        <td>{index + 1}.</td>
                                        <td className="scoreboard-cell">{summonerName}</td>
                                        <td className="scoreboard-cell score-cell">{score}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="current-tournament-statistics">
            <div className="tournament-overview">
                <div className="overview-section">
                    {renderScoreAndPlacing()}
                    {renderUserTeamStats()}
                </div>
                <div className="overview-section scoreboard-section">
                    {renderScoreboard()}
                </div>
            </div>
        </div>
    )
};
