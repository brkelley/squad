import React from 'react';

export default function PredictionMatch (props) {
    const { redSide, blueSide, predicted, onPredictionClick, index } = props;

    let redSideClassName = '';
    let blueSideClassName = '';
    if (predicted) {
        redSideClassName = predicted === redSide.name ? 'predicted' : 'not-predicted';
        blueSideClassName = predicted === blueSide.name ? 'predicted' : 'not-predicted'; 
    }

    return (
        <div className="prediction-match-wrapper">
            <div
                className={`team-wrapper red-side ${redSideClassName}`}
                onClick={() => onPredictionClick({ name: redSide.name, index })}>
                <div className="team-logo-wrapper">
                    <img
                        src={redSide.logo}
                        className="team-logo" />
                </div>
                <div className="team-name">
                    {redSide.name}
                </div>
            </div>
            <div
                className={`team-wrapper blue-side ${blueSideClassName}`}
                onClick={() => onPredictionClick({ name: blueSide.name, index })}>
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
    );
}
