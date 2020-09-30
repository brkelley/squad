import './series-match.scss';
import React, { useState } from 'react';
import moment from 'moment';
import connect from './series-match.connector';
import get from 'lodash/get';
import some from 'lodash/some';

const SeriesMatch = ({
    redSide,
    blueSide,
    matchMetadata,
    predictionMap,
    userId,
    updatePrediction
}) => {
    const prediction = get(predictionMap, `${userId}.${matchMetadata.id}.prediction`, '').split(',')
    const [predictionResults] = useState(prediction);
    const bestOfCount = get(matchMetadata, 'strategy.count');

    const setPredictionAtIndex = (prediction, index) => {
        predictionResults[index] = prediction;
        const winnerIndex = findTeamSeriesFinalIndex();
        if (winnerIndex <= 4) {
            predictionResults.length = winnerIndex + 1;
        }
        updatePrediction({
            prediction: predictionResults.join(','),
            matchId: matchMetadata.id,
            timestamp: (new Date()).getDate(),
            userId
        });
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

    const renderTeamBlock = (team, index, isTbd) => {
        const getNow = Date.now();
        const matchTime = moment(matchMetadata.startTime).valueOf();
        const predictionPassed = getNow >= matchTime;
        const gameNumbers = findTeamSeriesFinalIndex();
        const isExtraMatch = index > gameNumbers;
        const predicted = predictionResults[index] === team.name;

        const allowClick = !predictionPassed && !isExtraMatch && !isTbd;
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
        const isAnyTbd = some(matchMetadata.teams, { name: 'TBD' });
        for (let i = 0; i < bestOfCount; i++) {
            gameWrapper.push(
                <div
                    className="game-wrapper"
                    key={i}>
                    {renderTeamBlock(redSide, i, isAnyTbd)}
                    <div className="prediction-team-separator">
                        VS
                    </div>
                    {renderTeamBlock(blueSide, i, isAnyTbd)}
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
};

export default connect(SeriesMatch);
