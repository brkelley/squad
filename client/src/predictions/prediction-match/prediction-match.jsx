import './prediction-match.scss';

import React from 'react';
import get from 'lodash/get';
import moment from 'moment';

import SeriesMatch from './series-match/series-match.jsx';

export default function PredictionMatch ({
    matchMetadata,
    prediction,
    userId,
    leagueId,
    updatePrediction
}) {
    const [blueSide, redSide] = matchMetadata.match.teams;

    const predictionMetadata = prediction;
    const bestOfCount = get(matchMetadata, 'match.strategy.count');
    const predictionId = get(predictionMetadata, 'id');
    const predictedTeam = get(predictionMetadata, 'prediction');

    const renderPredicted = teamName => {
        if (predictedTeam && teamName !== predictedTeam) {
            return 'not-predicted';
        }
        return '';
    };

    const saveOrUpdatePrediction = async team => {
        if (predictedTeam === team) return;

        const getNow = Date.now();
        const matchTime = moment(matchMetadata.startTime).valueOf();

        if (getNow >= matchTime) return;

        const body = {
            ...predictionId && { id: predictionId },
            userId,
            matchId: matchMetadata.match.id,
            prediction: team,
            leagueId,
            matchTime: matchMetadata.startTime
        };

        updatePrediction(body);
    };

    const renderTeamBlock = team => {
        const getNow = Date.now();
        const matchTime = moment(matchMetadata.startTime).valueOf();
        const predictionPassed = getNow >= matchTime;

        const clickFcn = predictionPassed ? () => {} : () => saveOrUpdatePrediction(team.name);

        return (
            <div className={`prediction-team ${predictionPassed ? '' : 'hoverable'} blue-side`} onClick={clickFcn}>
                <img className={`team-image ${renderPredicted(team.name)}`} src={team.image} />
                <div className={`team-name ${renderPredicted(team.name)}`}>
                    {team.name}
                </div>
            </div>
        );
    };

    const renderSeriesBlock = () => {
        return (
            <SeriesMatch
                redSide={redSide}
                blueSide={blueSide}
                matchMetadata={matchMetadata}
                predictionMetadata={prediction}
                saveOrUpdatePrediction={saveOrUpdatePrediction}
            />
        );
    };

    const renderSingleGameBlock = () => {
        return (
            <div className="prediction-content">
                {renderTeamBlock(blueSide)}
                <div className="prediction-team-separator">
                    VS
                </div>
                {renderTeamBlock(redSide)}
            </div>
        );
    };

    return (
        <div className="prediction-match-wrapper">
            <div className="prediction-block">
                {moment(matchMetadata.startTime).format('h:mm A')}
            </div>
            {bestOfCount === 1 ? renderSingleGameBlock() : renderSeriesBlock()}
            <div className="prediction-block" />
        </div>
    );
};
