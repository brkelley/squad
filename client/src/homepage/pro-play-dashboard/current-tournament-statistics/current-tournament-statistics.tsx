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
import { TournamentSchedule, ScheduleTeam } from '../../../types/pro-play-metadata';
import { User } from '../../../types/user';
import isEmpty from 'lodash/isEmpty';
import some from 'lodash/some';

interface CurrentTournamentStatisticsProps {
    predictionMap: {
        [userId: string]: {
            [matchId: string]: Prediction;
        };
    };
    schedule: TournamentSchedule[];
    currentUser: User;
    users: User[];
    teams: ScheduleTeam[]
};
export default ({
    predictionMap,
    schedule,
    currentUser,
    users,
    teams
}: CurrentTournamentStatisticsProps) => {
    const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
    const [scoreboard, setScoreboard] = useState<UserTournamentStatistics[]>([]);
    const [userTeamStats, setUserTeamStats] = useState<UserTeamStats>();

    useEffect(() => {
        if (!isEmpty(predictionMap) && !isEmpty(schedule) && !isEmpty(users) && !isEmpty(teams)) {
            setScoreboard(calculateScoresByUsers({ predictionMap, schedule, currentUser, users }));
            setUserTeamStats(calculateUserTeamStats({ predictionMap, schedule, currentUser, teams }));
            setShowScoreboard(true);
        }
    }, [predictionMap, schedule, users, teams]);

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
                <div className="team-stat">
                    <img
                        className="team-stat-image"
                        src={mostGuessedTeam.image} />
                    <div className="team-stat-label">
                        most predicted
                    </div>
                </div>
                <div className="team-stat">
                    <img
                        className="team-stat-image"
                        src={mostWonTeam.image} />
                    <div className="team-stat-label">
                        most won
                    </div>
                </div>
                <div className="team-stat">
                    <img
                        className="team-stat-image"
                        src={mostIncorrectTeam.image} />
                    <div className="team-stat-label">
                        blindspot
                    </div>
                </div>
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
                            scoreboard.map(({ id, summonerName, score}) => {
                                const activeUserClass = id === currentUser.id ? 'active-user-row' : '';
                                return (
                                    <tr
                                        className={`scoreboard-row ${activeUserClass}`}
                                        key={id}>
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
