import './prediction-widget.scss';
import React from 'react';
import Bo1Grid from './bo1-grid/bo1-grid.jsx';
import Bo5Grid from './bo5-grid/bo5-grid.jsx';
import LEAGUES_METADATA from '../../constants/leagues.json';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';

const PredictionWidget = ({
    schedule,
    timespan,
    usersMetadata,
    predictionMap
}) => {
    const currentMatches = flatMap(Object.values(schedule))
        .filter(el => el.blockName === timespan && get(el.match, 'type') !== 'tiebreaker')
        .map(match => ({
            ...match.match,
            league: LEAGUES_METADATA.find(league => league.name === match.league.name),
            startTime: match.startTime,
            state: match.state
        }));

    const renderCorrectTable = () => {
        const seriesCount = get(currentMatches[0], 'strategy.count');
        switch (seriesCount) {
            case 1:
                return (
                    <Bo1Grid
                        matches={currentMatches}
                        usersMetadata={usersMetadata}
                        predictionMap={predictionMap}
                    />
                );
            case 5:
                return (
                    <Bo5Grid
                        matches={currentMatches}
                        usersMetadata={usersMetadata}
                        predictionMap={predictionMap}
                    />
                );
            default:
                return <div>Butts!</div>;
        }
    };

    return (
        <div className="prediction-widget-wrapper">
            <div className="block-title">
                {timespan}
            </div>
            {renderCorrectTable()}
        </div>
    );
};

export default PredictionWidget;
