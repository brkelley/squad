import './homepage.scss';
import React, { useState, useEffect } from 'react';
import connectHomepage from './homepage.connector.js';

import LoadingIndicator from '../components/loading-indicator/loading-indicator';
import AchievementWidget from './achievement-widget/achievement-widget';
import ActiveSplitWidget from './active-split-widget/active-split-widget';
import PredictionWidget from './prediction-widget/prediction-widget';
import FavoriteTeamNews from './favorite-team-news/favorite-team-news';
import { sortMatchesByDate, MatchesByDate } from './utils/homepage-util';
import LEAGUES_METADATA from '../constants/leagues.json';

import moment from 'moment';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

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
    const [matchesByDate, setMatchesByDate] = useState<MatchesByDate[]>([]);
    const [nextDateIndex, setNextDateIndex] = useState<number>(-1);

    useEffect(() => {
        loadAllUsers();
        loadAllPredictions();
        loadAllSchedule();
    }, []);

    useEffect(() => {
        if (!isEmpty(schedule)) {
            findBlocksToDisplay({ schedule });
        }
    }, [schedule]);

    useEffect(() => {
        const currentDate = moment();
        setNextDateIndex(matchesByDate.findIndex((matches) => !currentDate.isAfter(matches.startTime)));
        console.log('matchesByDate:', matchesByDate)
    }, [matchesByDate]);

    const findBlocksToDisplay = ({ schedule }) => {
        setMatchesByDate(sortMatchesByDate({ schedule }));
    };

    const renderMainHomePage = () => {
        if (userFetching) {
            return (
                <div className="loading-wrapper">
                    <LoadingIndicator />
                </div>
            );
        }

        const userPlacings = get(user, 'splitStats', {});
        const favoriteTeam = get(user.preferences, 'favoriteTeam');
        let secondaryWidget;

        if (favoriteTeam) {
            const leagueId = LEAGUES_METADATA.find((league) => favoriteTeam.homeLeague.name === league.name);
            const leagueSchedule = schedule[get(leagueId, 'id', -1)];
            secondaryWidget = (
                <FavoriteTeamNews
                    favoriteTeam={favoriteTeam}
                    schedule={leagueSchedule} />
            );

        } else {
            secondaryWidget = (
                <AchievementWidget
                    userPlacings={userPlacings} />
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
                        {secondaryWidget}
                    </div>
                </div>
                {nextDateIndex}
                {
                    (nextDateIndex === -1) ? ('') : Array(nextDateIndex).fill(null).map((_, i) => (
                        <div
                            className="homepage-row"
                            key={i}>
                            <div className="widget-wrapper">
                                <PredictionWidget
                                    matches={matchesByDate[nextDateIndex - i - 1].matches}
                                    blockName={`Week ${nextDateIndex - (i)}`}
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
