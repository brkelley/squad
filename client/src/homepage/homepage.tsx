import './homepage.scss';
import React, { useEffect } from 'react';
import connectHomepage from './homepage.connector.js';

import LoadingIndicator from '../components/loading-indicator/loading-indicator';
import AchievementWidget from './achievement-widget/achievement-widget';
import ActiveSplitWidget from './active-split-widget/active-split-widget';

const Homepage = ({
    user,
    users,
    userFetching,
    predictionMap,
    schedule,
    loadAllUsers,
    loadAllPredictions,
    loadAllSchedule
}) => {
    useEffect(() => {
        loadAllUsers();
        loadAllPredictions();
        loadAllSchedule();
    }, []);
    const renderMainHomePage = () => {
        if (userFetching) {
            return (
                <div className="loading-wrapper">
                    <LoadingIndicator />
                </div>
            );
        }
    
        return (
            <div className="homepage-wrapper">
                <div className="widget-wrapper">
                    <ActiveSplitWidget
                        users={users}
                        user={user}
                        predictionMap={predictionMap}
                        schedule={schedule} />
                </div>
                <div className="widget-wrapper">
                    <AchievementWidget
                        user={user} />
                </div>
            </div>
        );
    };

    return renderMainHomePage();
};

export default connectHomepage(Homepage);
