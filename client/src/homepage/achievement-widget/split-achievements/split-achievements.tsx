import './split-achievements.scss';
import React from 'react';

import { UserSplitAchievement } from '../../../types/predictions';

const splitTitleMap = {
    spring2020: 'Spring 2020'
};

const splitKeyMap = {
    blindspot: {
        title: 'blind spot',
        order: 5
    },
    finalScore: {
        title: 'final score',
        order: 2
    },
    mostPredicted: {
        title: 'most predicted',
        order: 3
    },
    mostWon: {
        title: 'most won',
        order: 4
    },
    placement: {
        title: 'placement',
        order: 1
    }
};

const convertNumberToCardinal = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j == 1 && k != 11) {
        return num + 'st';
    }
    if (j == 2 && k != 12) {
        return num + 'nd';
    }
    if (j == 3 && k != 13) {
        return num + 'rd';
    }

    return num + 'th';
};

export default function SplitAchievements ({ splitData }: { splitData: UserSplitAchievement }) {
    const { splitName, splitStats } = splitData;

    console.log('splitStats:', splitStats);

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
            {renderSecondarySplitStats(0)}
            {renderSecondarySplitStats(1)}
        </div>
    );
};
