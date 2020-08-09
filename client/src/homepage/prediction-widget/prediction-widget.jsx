import './prediction-widget.scss';
import React from 'react';
import Bo1Grid from './bo1-grid/bo1-grid.jsx';
import Bo5Grid from './bo5-grid/bo5-grid.jsx';
import LEAGUES_METADATA from '../../constants/leagues.json';
import get from 'lodash/get';

const PredictionWidget = ({
    matches,
    blockName,
    usersMetadata,
    predictionMap
}) => {
    console.log(blockName)
    console.log(matches)
    const renderCorrectTable = () => {
        const seriesCount = get(matches[0], 'strategy.count');
        switch (seriesCount) {
            case 1:
                return (
                    <Bo1Grid
                        matches={matches}
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
                return <div></div>;
        }
    };

    return (
        <div className="prediction-widget-wrapper">
            <div className="block-title">
                {blockName}
            </div>
            {renderCorrectTable()}
        </div>
    );
};

export default PredictionWidget;
