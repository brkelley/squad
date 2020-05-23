import './split-achievements.scss';
import React from 'react';

import { UserSplitAchievement } from '../../../types/predictions';
import { convertNumberToCardinal } from '../../../utils/common.util';

const splitTitleMap = {
    spring2020: 'Spring 2020'
};

export default function SplitAchievements ({ splitData }: { splitData: UserSplitAchievement }) {
    const { splitName, splitStats } = splitData;

    const renderMainSplitStats = () => {
        return (
            <div className="main-split-stats">
                <div className="main-split-stat split-title">
                    {splitTitleMap[splitName]}
                </div>
                <div className="main-split-stat split-sub-title split-placement">
                    {convertNumberToCardinal(splitStats.placement)}
                </div>
                <div className="main-split-stat split-sub-title">
                    {splitStats.score} points
                </div>
            </div>
        );
    };

    const renderSecondarySplitStats = (column) => {
        if (column === 0) {
            return (
                <div className="secondary-split-stats">
                    <div className="secondary-split-stat">
                        <div className="split-stat-value">
                            <img
                                className="team-logo"
                                src={splitStats.mostPredicted.image} />
                        </div>
                        <div className="split-stat-label">
                            most predicted
                        </div>
                    </div>
                    <div className="secondary-split-stat bottom-stat">
                        <div className="split-stat-value">
                            <img
                                className="team-logo"
                                src={splitStats.blindspot.image} />
                        </div>
                        <div className="split-stat-label">
                            blindspot
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="secondary-split-stats">
                <div className="secondary-split-stat">
                    <div className="split-stat-value">
                        <img
                            className="team-logo"
                            src={splitStats.mostWon.image} />
                    </div>
                    <div className="split-stat-label">
                        most won
                    </div>
                </div>
                <div className="secondary-split-stat bottom-stat">
                    <div />
                    <div className="split-stat-value text-value">
                        {splitStats.mostGuessedSeriesScore}
                    </div>
                    <div className="split-stat-label">
                        most guessed score
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="split-achievement-widget">
            {renderMainSplitStats()}
            <div className="secondary-split-stats-wrapper">
                {renderSecondarySplitStats(0)}
                {renderSecondarySplitStats(1)}
            </div>
        </div>
    );
};
