import './homepage.scss';
import React, { useState, useEffect } from 'react';
import connectHomepage from './homepage.connector.js';

import LoadingIndicator from '../components/loading-indicator/loading-indicator';
import AchievementWidget from './achievement-widget/achievement-widget';
import ActiveSplitWidget from './active-split-widget/active-split-widget';
import PredictionWidget from './prediction-widget/prediction-widget';

import chain from 'lodash/chain';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import uniq from 'lodash/uniq';

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
    const [upcomingWeek, setUpcomingWeek] = useState<string[]>([]);

    useEffect(() => {
        loadAllUsers();
        loadAllPredictions();
        loadAllSchedule();
    }, []);

    useEffect(() => {
        if (!isEmpty(schedule)) {
            setUpcomingWeek(findNextWeek({ schedule }).reverse());
        }
    }, [schedule]);

    const findNextWeek = ({ schedule }): string[] => {
        const now = new Date().getTime();
        const lecSchedule = values(schedule)[0].map(el => new Date(el.startTime).getTime());
        const lcsSchedule = values(schedule)[1].map(el => new Date(el.startTime).getTime());

        const upcomingLECIndex = lecSchedule.findIndex((matchTime) => matchTime > now);
        const upcomingLCSIndex = lcsSchedule.findIndex((matchTime) => matchTime > now);

        const lecGames = values(schedule)[0];
        
        return uniq(
            lecGames
                .slice(0, upcomingLECIndex + 1)
                .map((el) => el.blockName)
        );
    };

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
                <div className="homepage-row">
                    <div className="widget-wrapper">
                        {get(users.find(el => el.id === user.id), 'flags.hasPredictions', false) && 
                        <ActiveSplitWidget
                            users={users}
                            user={user}
                            predictionMap={predictionMap}
                            schedule={schedule} />
                        }
                    </div>
                    <div className="widget-wrapper">
                        <AchievementWidget
                            user={user} />
                    </div>
                </div>
                {
                    upcomingWeek.map((blockName) => (
                        <div
                            className="homepage-row"
                            key={blockName}>
                            <div className="widget-wrapper">
                                <PredictionWidget
                                    schedule={schedule}
                                    timespan={blockName}
                                    usersMetadata={users}
                                    predictionMap={predictionMap} />
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    };

    return renderMainHomePage();
};

export default connectHomepage(Homepage);
