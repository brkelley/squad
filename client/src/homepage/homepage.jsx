import './homepage.scss';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import PredictionWidget from './prediction-widget/prediction-widget.jsx';
import PredictionAnalytics from './prediction-analytics/prediction-analytics.jsx';
import LoadingIndicator from '../components/loading-indicator/loading-indicator.jsx';

import { getAllUsers } from '../store/user/user.actions.js';
import { retrievePredictions } from '../store/predictions/predictions.actions.js';
import { retrieveSchedule } from '../store/pro-play-metadata/pro-play-metadata.actions.js';

const Homepage = props => {
    const [blocksToDate, setBlocksToDate] = useState([]);

    const findBlocksToDisplay = schedule => {
        const currentDate = moment().valueOf();
        let latestGameIndex = schedule.findIndex(match => {
            const matchDate = moment(match.startTime).valueOf();
            return currentDate <= matchDate;
        });

        if (latestGameIndex === -1) {
            latestGameIndex = 90;
        }
        if (schedule[latestGameIndex + 1]) latestGameIndex++;
        let blocks = schedule.map(el => el.blockName);
        blocks = uniq(blocks).reverse();
        return blocks;
    };

    useEffect(() => {
        props.getAllUsers();
        props.retrievePredictions({ forceReload: false });
        props.retrieveSchedule();
    }, []);

    useEffect(() => {
        if (props.schedule && !isEmpty(props.schedule)) {
            setBlocksToDate(findBlocksToDisplay(Object.values(props.schedule)[1]));
        }
    }, [props.schedule]);

    if (props.scheduleFetching || props.predictionFetching || props.userFetching) {
        return (
            <div className="loading-wrapper">
                <LoadingIndicator />
            </div>
        );
    }

    return (
        <div className="homepage-wrapper">
            <PredictionAnalytics
                predictionMap={props.predictionMap}
                users={props.usersMetadata}
                user={props.user}
                schedule={props.schedule}
            />
            {
                blocksToDate.map(block => {
                    return (
                        <PredictionWidget
                            key={block}
                            timespan={block}
                            usersMetadata={props.usersMetadata}
                            predictionMap={props.predictionMap}
                            schedule={props.schedule}
                            scheduleFetching={props.scheduleFetching}
                        />
                    );
                })
            }
        </div>
    );
};

const mapStateToProps = ({ userReducer, predictionReducer, proPlayMetadataReducer }) => ({
    usersMetadata: userReducer.usersMetadata,
    schedule: proPlayMetadataReducer.schedule,
    scheduleFetching: proPlayMetadataReducer.scheduleFetching,
    predictionFilters: predictionReducer.predictionFilters,
    predictionMap: predictionReducer.predictionMap,
    predictionFetching: predictionReducer.fetching,
    userFetching: userReducer.fetching,
    predictionScoresByUser: predictionReducer.predictionScoresByUser,
    user: userReducer.user
});

const mapDispatchToProps = dispatch => ({
    getAllUsers: () => dispatch(getAllUsers()),
    retrievePredictions: props => dispatch(retrievePredictions(props)),
    retrieveSchedule: () => dispatch(retrieveSchedule())
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
