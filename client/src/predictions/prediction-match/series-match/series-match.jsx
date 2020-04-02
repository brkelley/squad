import './series-match.scss';

import React, { useState } from 'react';

import moment from 'moment';
import get from 'lodash/get';

export default function SeriesMatch ({
    redSide,
    blueSide,
    matchMetadata,
    predictionMetadata,
    saveOrUpdatePrediction
}) {
    const [predictionResults] = useState(
        get(predictionMetadata, 'prediction', '').split(',')
    );
    const bestOfCount = get(matchMetadata, 'match.strategy.count');

    const setPredictionAtIndex = (prediction, index) => {
        predictionResults[index] = prediction;
        const winnerIndex = findTeamSeriesFinalIndex();
        if (winnerIndex <= 4) {
            predictionResults.length = winnerIndex + 1;
        }
        saveOrUpdatePrediction(predictionResults.join(','));
    };

    const findTeamSeriesFinalIndex = () => {
        const stats = {
            [redSide.name]: 0,
            [blueSide.name]: 0
        };

        for (let i = 0; i < predictionResults.length; i++) {
            stats[predictionResults[i]]++;

            if (stats[predictionResults[i]] === 3) {
                return i;
            }
        }

        return 999;
    };

    const renderTeamBlock = (team, index) => {
        const getNow = Date.now();
        const matchTime = moment(matchMetadata.startTime).valueOf();
        const predictionPassed = getNow >= matchTime;
        const gameNumbers = findTeamSeriesFinalIndex();
        const isExtraMatch = index > gameNumbers;
        const predicted = predictionResults[index] === team.name;

        const allowClick = !predictionPassed && !isExtraMatch;
        const teamClassName = (predictionResults[index] && !predicted) || isExtraMatch ? 'not-predicted' : '';

        const clickFcn = !allowClick ? () => {} : () => setPredictionAtIndex(team.name, index);

        return (
            <div className={`prediction-team ${allowClick ? 'hoverable' : ''} blue-side`} onClick={clickFcn}>
                <img className={`team-image ${teamClassName}`} src={team.image} />
            </div>
        );
    };

    const renderSeriesWrapper = () => {
        const gameWrapper = [];
        for (let i = 0; i < bestOfCount; i++) {
            gameWrapper.push(
                <div
                    className="game-wrapper"
                    key={i}>
                    {renderTeamBlock(redSide, i)}
                    <div className="prediction-team-separator">
                        VS
                    </div>
                    {renderTeamBlock(blueSide, i)}
                </div>
            );
        }
        return gameWrapper;
    };

    return (
        <div className="prediction-content">
            {renderSeriesWrapper()}
        </div>
    );
}
