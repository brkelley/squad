import React from 'react';

export default function PredictionMatch (props) {
    const { redSide, blueSide } = props;
    return (
        <div className="prediction-match-wrapper">
            <div className="team-wrapper red-side">
                <div className="team-logo-wrapper">
                    <img
                        src={redSide.logo}
                        className="team-logo" />
                </div>
                <div className="team-name">
                    {redSide.name}
                </div>
            </div>
            <div className="team-wrapper blue-side">
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
