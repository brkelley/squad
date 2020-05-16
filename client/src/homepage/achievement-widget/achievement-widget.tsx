import './achievement-widget.scss';
import React from 'react';

import SplitAchievements from './split-achievements/split-achievements';
import { SplitStats } from '../../types/predictions';
import get from 'lodash/get';
import toPairs from 'lodash/toPairs';

const AchievementWidget = ({ user }) => {
    const convertToCardinal = (number) => {
        const tensPlace = number % 10;
        let suffix;
        if (tensPlace === 1 && number !== 11) {
            suffix = 'st';
        } else if (tensPlace === 2 && number !== 12) {
            suffix = 'nd';
        } else if (tensPlace === 3 && number !== 13) {
            suffix = 'rd';
        } else {
            suffix = 'th';
        }
        
        return `${number}${suffix}`;
    };

    const renderAwards = () => {
        const userPlacings = get(user, 'placings', {});
        return toPairs(userPlacings).map(([splitName, splitStats]: [string, SplitStats]) => {
            return (
                <div
                    className="split-placing"
                    key={name}>
                    <SplitAchievements splitData={{ splitName, splitStats }} />
                </div>
            )
        })
    };

    return (
        <div className="achievement-widget">
            <div className="achievement-widget-title">
                History
            </div>
            <div className="split-placings-wrapper">
                {renderAwards()}
            </div>
        </div>
    );
};

export default AchievementWidget;
