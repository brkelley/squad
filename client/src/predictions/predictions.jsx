import './predictions.scss';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { retrievePredictions, updatePrediction } from '../store/predictions/predictions.actions.js';
import { retrieveLeagues, retrieveSchedule } from '../store/pro-play-metadata/pro-play-metadata.actions.js';

import PredictionMatch from './prediction-match/prediction-match.jsx';
import PredictionFiltersContainer from './prediction-filters/prediction-filters.container.jsx';
import LoadingIndicator from '../components/loading-indicator/loading-indicator.jsx';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import keyBy from 'lodash/keyBy';
import moment from 'moment';

const Predictions = (props) => {
    const [ predictionsLoading, setPredictionsLoading ] = useState(false);

    const retrievePredictions = async forceReload => {
        if (!forceReload && !isEmpty(props.predictionMap)) return;

        setPredictionsLoading(true);
        const leagueId = props.predictionFilters.leagueId;
        try {
            await props.retrievePredictions({ forceReload, leagueId });
            await props.retrieveSchedule();
        } catch (error) {
            console.log(error);
        }
        setPredictionsLoading(false);
    };

    useEffect(() => {
        retrievePredictions();
    }, [props.predictionFilters]);

    const retrieveLeagues = async () => {
        if (!isEmpty(props.leagues)) return;
        props.retrieveLeagues();
    };

    const init = () => {
        retrieveLeagues();
    }

    init();

    const groupScheduleByDay = predictions => {
        const predictionsByDay = predictions.reduce((grouped, prediction) => {
            const dateStamp = moment(prediction.startTime).format('MMMDD');
            if (grouped[dateStamp]) {
                grouped[dateStamp].push(prediction);
            } else {
                grouped[dateStamp] = [prediction];
            }
            return grouped;
        }, {});
        return Object.values(predictionsByDay);
    };

    const renderPrediction = (match, prediction) => {
        return (
            <div
                className="prediction-set-wrapper"
                key={match.match.id}>
                <PredictionMatch
                    matchMetadata={match}
                    userId={props.userId}
                    prediction={prediction}
                    leagueId={props.predictionFilters.leagueId}
                    updatePrediction={props.updatePrediction} />
            </div>
        );
    }

    const renderBlockName = match => {
        return (
            <div className="block-name-wrapper">
                {match.blockName}
            </div>
        );
    };

    const renderDatestamp = (match, topPadding) => {
        return (
            <div className={`datestamp-wrapper ${topPadding && 'solo-datestamp'}`}>
                {moment(match.startTime).format('dddd, MMMM D')}
            </div>
        );
    };

    const renderPredictionSets = () => {
        if (!props.predictionMap) return;

        const userPredictions = get(props.predictionMap, `${props.predictionFilters.leagueId}.${props.userId}`, []);

        const schedule = get(props.schedule, props.predictionFilters.leagueId, [])
            // .filter(el => ['unstarted', 'inProgress'].includes(el.state));

        const groupedMatches = groupScheduleByDay(schedule);
        const groupedPredictions = keyBy(userPredictions, 'matchId');
        let blockName = '';
        let renderBlock = false;

        return groupedMatches.map(matches => {
            if (blockName !== matches[0].blockName) {
                renderBlock = true;
                blockName = matches[0].blockName;
            } else {
                renderBlock = false;
            }
            return (
                <div
                    className="prediction-day-wrapper"
                    key={moment(matches[0].startTime).format('MMMDD')}>
                    {
                        renderBlock && renderBlockName(matches[0])
                    }
                    {
                        renderDatestamp(matches[0], !renderBlock)
                    }
                    {
                        matches.map(match => renderPrediction(match, groupedPredictions[match.match.id]))
                    }
                </div>
            );
            
        });
    };

    const renderPredictionsContent = () => {
        if (predictionsLoading) {
            return (
                <div className="loading-indicator-wrapper">
                    <LoadingIndicator />
                </div>
            );
        } else {
            return (
                <div className="predictions-content">
                    <PredictionFiltersContainer
                        leagues={props.leagues.filter(el => ['LEC', 'LCS'].includes(el.name))}
                        filters={props.predictionFilters} />
                    {renderPredictionSets()}
                </div>
            );
        }
    };

    return (
        <div className="predictions-wrapper">
            {renderPredictionsContent()}
        </div>
    );
};

const mapStateToProps = ({ userReducer, predictionReducer, proPlayMetadataReducer }) => ({
    userId: userReducer.user.id,
    predictionMap: predictionReducer.predictionMap,
    predictionFilters: predictionReducer.predictionFilters,
    leagues: proPlayMetadataReducer.leagues,
    schedule: proPlayMetadataReducer.schedule
});

const mapDispatchToProps = dispatch => ({
    retrievePredictions: options => dispatch(retrievePredictions(options)),
    updatePrediction: prediction => dispatch(updatePrediction(prediction)),
    retrieveLeagues: () => dispatch(retrieveLeagues()),
    retrieveSchedule: () => dispatch(retrieveSchedule())
});

export default connect(mapStateToProps, mapDispatchToProps)(Predictions);
