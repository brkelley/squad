import './predictions.scss';
import React, { useState, useEffect } from 'react';

import PredictionMatch from './prediction-match/prediction-match.jsx';
import PredictionFiltersContainer from './prediction-filters/prediction-filters.container.jsx';
import LoadingIndicator from '../components/loading-indicator/loading-indicator.jsx';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

export default function Predictions (props) {
    const [ predictionsLoading, setPredictionsLoading ] = useState(false);

    const retrievePredictions = async forceReload => {
        setPredictionsLoading(true);
        if (!forceReload && !isEmpty(props.predictionMap)) return;

        const leagueId = props.predictionFilters.leagueId;
        await props.retrievePredictions({ forceReload, leagueId });
        setPredictionsLoading(false);
    };

    useEffect(() => {
        retrievePredictions(true);
    }, [props.predictionFilters]);

    const retrieveLeagues = async () => {
        if (!isEmpty(props.leagues)) return;
        props.retrieveLeagues();
    };

    const init = () => {
        retrieveLeagues();
    }

    init();

    const groupPredictionsByDay = predictions => {
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

    const renderPrediction = match => {
        return (
            <div
                className="prediction-se-wrapper"
                key={match.match.id}>
                <PredictionMatch
                    matchMetadata={match}
                    userId={props.userId}
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

        const uncompletedMatches = Object.values(props.predictionMap)
            .filter(el => ['unstarted', 'inProgress'].includes(el.state));
        const groupedMatches = groupPredictionsByDay(uncompletedMatches);
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
                    {renderBlock && renderBlockName(matches[0])}
                    {renderDatestamp(matches[0], !renderBlock)}
                    { matches.map(match => renderPrediction(match)) }
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
