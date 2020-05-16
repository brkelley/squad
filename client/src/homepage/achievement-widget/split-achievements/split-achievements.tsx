import './split-achievements.scss';
import React, { ReactElement } from 'react';

import { UserSplitAchievement } from '../../../types/predictions';
import toPairs from 'lodash/toPairs';

const splitTitleMap = {
    spring2020: 'Spring 2020'
};

export default function SplitAchievements ({ splitData }: { splitData: UserSplitAchievement }) {
    const { splitName, splitStats } = splitData;

    const renderSplitStats = () => {
        const splitStatsArray:ReactElement[] = [];
        toPairs(splitStats).forEach(([key, value]) => {
            splitStatsArray.push(
                <div className="split-stat-key">
                    {key}
                </div>
            );
            splitStatsArray.push(
                <div className="split-stat-value">
                    1234
                </div>
            );
        });
        
        return splitStatsArray;
    };

    return (
        <div className="split-achievement-widget">
            <div className="split-title">
                {splitTitleMap[splitName]}
            </div>
            {...renderSplitStats()}
        </div>
    );
};
