import './achievement-widget.scss';
import React from 'react';

import SplitAchievements from './split-achievements/split-achievements';
import { SplitStats } from '../../types/predictions';
import get from 'lodash/get';
import toPairs from 'lodash/toPairs';

const AchievementWidget = ({ user }) => {
    const renderAwards = () => {
        const userPlacings = get(user, 'splitStats', {});

        return toPairs(userPlacings).map(([splitName, splitStats]: [string, SplitStats]) => {
            return (
                <div
                    className="split-placing"
                    key={name}>
                    {splitStats && <SplitAchievements splitData={{ splitName, splitStats }} />}
                </div>
            )
        })
    };

    return (
        <div className="achievement-widget">
            <div className="split-placings-wrapper">
                {renderAwards()}
            </div>
        </div>
    );
};

export default AchievementWidget;
