import './active-split-widget.scss';
import React, { useState, useEffect } from 'react';

import { calculateUserSplitStatistics } from './active-split-widget.helper.js';
import { convertNumberToCardinal } from '../../utils/common.util';
import { Team, LeaderboardEntry } from '../../types/predictions';
import get from 'lodash/get';

const ActiveSplitWidget = ({ users, user, predictionMap, schedule }) => {
    const [score, setScore] = useState(0);
    const [placement, setPlacement] = useState(0);
    const [mostPredicted, setMostPredicted] = useState<Team>();
    const [mostWon, setMostWon] = useState<Team>();
    const [blindspot, setBlindspot] = useState<Team>();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const userStatistics = calculateUserSplitStatistics({ users, schedule, predictionMap });

        setScore(userStatistics.score);
        setPlacement(userStatistics.placement);
        setMostPredicted(userStatistics.mostPredicted);
        setMostWon(userStatistics.mostWon);
        setBlindspot(userStatistics.blindspot);
        setLeaderboard(userStatistics.leaderboard);
    }, [users, schedule, predictionMap]);

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
                    <img
                        className="stat-logo"
                        src={get(mostPredicted, 'image', '')} />
                    <div className="stat-label">
                        most predicted
                    </div>
                </div>
                <div className="secondary-split-stat image-stat">
                    <img
                        className="stat-logo"
                        src={get(mostWon, 'image', '')} />
                    <div className="stat-label">
                        most won
                    </div>
                </div>
                <div className="secondary-split-stat image-stat">
                    <img
                        className="stat-logo"
                        src={get(blindspot, 'image', '')} />
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
