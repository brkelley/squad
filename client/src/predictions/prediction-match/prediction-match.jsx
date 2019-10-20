import React from 'react';
import moment from 'moment';

export default function PredictionMatch (props) {
    const { redSide, blueSide, bestOf, time, predicted, onPredictionClick, results } = props;

    let redSideClassName = '';
    let blueSideClassName = '';
    let conditionalClass = '';
    const hasPredictionPassed = (new Date()).getTime() > time;
    let expiredPredictionFlag = false;

    if (predicted) {
        redSideClassName = predicted === redSide.name ? 'predicted' : 'not-predicted';
        blueSideClassName = predicted === blueSide.name ? 'predicted' : 'not-predicted'; 
    }
    if (!hasPredictionPassed) {
        conditionalClass = 'predicted-hover';
    }

    const onClick = hasPredictionPassed
        ? () => () => {}
        : name => () => {
            if ((new Date()).getTime() > time) {
                expiredPredictionFlag = true;
            } else {
                onPredictionClick({ name, time });
            }
        };

    let resultsComponent = '';

    if (results) {
        resultsComponent = (
            <div className="prediction-results-indicator">
                <i className={`fa fa-${results && results === predicted ? 'check' : 'times'}`}></i>
            </div>
        );
    }

    const renderClickablePredictions = () => {
        return (
            <div className="prediction-match">
                <div className={`prediction-card ${!hasPredictionPassed && 'active-card'}`}>
                    <div
                        className={`team-wrapper red-side ${redSideClassName} ${conditionalClass}`}
                        onClick={onClick(redSide.name)}>
                        <div className="team-logo-wrapper">
                            <img
                                src={redSide.logo}
                                className="team-logo" />
                        </div>
                        <div className="team-name">
                            {redSide.name}
                        </div>
                    </div>
                    {resultsComponent}
                    <div
                        className={`team-wrapper blue-side ${blueSideClassName} ${conditionalClass}`}
                        onClick={onClick(blueSide.name)}>
                        <div className="team-logo-wrapper">
                            <img
                                src={blueSide.logo}
                                className="team-logo" />
                        </div>
                        <div className="team-name">
                            {blueSide.name}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="prediction-match-wrapper">
            <div className="prediction-time">
                {moment(time).format('ha')}
            </div>
            {renderClickablePredictions()}
        </div>
    );
}
