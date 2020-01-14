import React, { useEffect } from 'react';
import './predictions.scss';

import PredictionMatch from './prediction-match/prediction-match.jsx';
import PredictionFiltersContainer from './prediction-filters/prediction-filters.container.jsx';
import isEmpty from 'lodash/isEmpty';
import keyBy from 'lodash/keyBy';
import moment from 'moment';

export default function Predictions (props) {
    const retrievePredictions = async forceReload => {
        if (!forceReload && !isEmpty(props.predictionMap)) return;

        const leagueId = props.predictionFilters.leagueId;
        props.retrievePredictions({ forceReload, leagueId });
    };

    useEffect(() => {
        retrievePredictions(true);
    }, [props.predictionFilters]);

    const retrieveLeagues = async () => {
        if (!isEmpty(props.leagues)) return;
        props.retrieveLeagues();
    };

    const init = () => {
        retrievePredictions();
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
                {moment(match.startTime).format('dddd, MMMM do')}
            </div>
        );
    };

    const renderPredictionSets = () => {
        if (!props.predictionMap) return;

        const groupedMatches = groupPredictionsByDay(Object.values(props.predictionMap));
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

    return (
        <div className="predictions-wrapper">
            <div className="page-title-wrapper">
                Predictions
            </div>
            <PredictionFiltersContainer
                leagues={props.leagues.filter(el => ['LEC', 'LCS'].includes(el.name))}
                filters={props.predictionFilters} />
            {renderPredictionSets()}
        </div>
    );
};