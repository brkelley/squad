import './active-split-widget.scss';
import React, { useState, useEffect } from 'react';
import { Team } from '../../types/predictions';

import { calculateUserSplitStatistics } from './active-split-widget.helper.js';
import { convertNumberToCardinal } from '../../utils/common.util';
import LoadingIndicator from '../../components/loading-indicator/loading-indicator';
import isEmpty from 'lodash/isEmpty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNinja } from '@fortawesome/free-solid-svg-icons';

interface LeaderboardEntry {
    id: string,
    name: string,
    score: number
};

const ActiveSplitWidget = ({ users, user, predictionMap, schedule }) => {
    const [widgetLoading, setWidgetLoading] = useState<boolean>(true);
    const [score, setScore] = useState<number>(0);
    const [placement, setPlacement] = useState<number>(-1);
    const [mostPredicted, setMostPredicted] = useState<Team>();
    const [mostWon, setMostWon] = useState<Team>();
    const [blindspot, setBlindspot] = useState<Team>();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        if (isEmpty(users) || isEmpty(schedule) || isEmpty(predictionMap)) return;
        const stats = calculateUserSplitStatistics({ userId: user.id, users, schedule, predictionMap });

        setScore(stats.score);
        setPlacement(stats.placement);
        setMostPredicted(stats.mostPredicted);
        setMostWon(stats.mostWon);
        setBlindspot(stats.blindspot);
        setLeaderboard(stats.leaderboard);
        setWidgetLoading(false);
    }, [users, schedule, predictionMap]);

    const renderTeamIcon = (team) => {
        if (!team) {
            return (
                <div className="stat-logo">
                    <FontAwesomeIcon
                        className="missing-team-icon"
                        icon={faUserNinja} />
                </div>
            );
        }

        return <img
            className="stat-logo"
            src={team.image} />;
    };

    const renderLeaderboard = () => {
        return (
            <div className="leaderboard-wrapper">
                {leaderboard.map((boardEntry) => (
                    <div
                        className={`board-entry ${(boardEntry.id === user.id) ? 'active-user' : ''}`}
                        key={boardEntry.id}>
                        <div className="board-name">
                            {boardEntry.name}
                        </div>
                        <div className="board-score">
                            {boardEntry.score}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (widgetLoading) {
        return (
            <div className="active-split-widget-wrapper">
                <div className="loading-wrapper">
                    <LoadingIndicator theme="light" />
                </div>
            </div>
        );
    }

    return (
        <div className="active-split-widget-wrapper">
            <div className="primary-split-stats">
                <div className="primary-split-stat split-title">
                    Summer 2020
                </div>
                <div className="primary-split-stat split-placement">
                    {convertNumberToCardinal(placement)}
                </div>
                <div className="primary-split-stat split-score">
                    {score} points
                </div>
            </div>
            <div className="secondary-split-stats">
                <div className="secondary-split-stat image-stat">
                    {renderTeamIcon(mostPredicted)}
                    <div className="stat-label">
                        most predicted
                    </div>
                </div>
                <div className="secondary-split-stat image-stat">
                    {renderTeamIcon(mostWon)}
                    <div className="stat-label">
                        most won
                    </div>
                </div>
                <div className="secondary-split-stat image-stat">
                    {renderTeamIcon(blindspot)}
                    <div className="stat-label">
                        blindspot
                    </div>
                </div>
            </div>
            <div className="leaderboard-border"></div>
            {renderLeaderboard()}
        </div>
    );
};

export default ActiveSplitWidget;
