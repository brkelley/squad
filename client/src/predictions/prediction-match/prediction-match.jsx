import './prediction-match.scss';

import React from 'react';
import get from 'lodash/get';
import moment from 'moment';

export default function PredictionMatch (props) {
    const [blueSide, redSide] = props.matchMetadata.match.teams;

    const predictionMetadata = props.matchMetadata.match.prediction;
    const predictionId = get(predictionMetadata, 'id');
    const predictedTeam = get(predictionMetadata, 'team');

    const renderPredicted = (teamName) => {
        if (predictedTeam && teamName !== predictedTeam) {
            return 'not-predicted';
        }
    };

    const saveOrUpdatePrediction = async team => {
        if (predictedTeam === team) return;
        const body = {
            ...predictionId && { id: predictionId },
            userId: props.userId,
            matchId: props.matchMetadata.match.id,
            prediction: team,
            leagueId: props.leagueId
        };

        props.updatePrediction(body);
    };

    return (
        <div className="prediction-match-wrapper">
            <div className="prediction-block">
                {moment(props.matchMetadata.startTime).format('h:mm A')}
            </div>
            <div className="prediction-content">
                <div className="prediction-team blue-side" onClick={() => saveOrUpdatePrediction(blueSide.name)}>
                    <img className={`team-image ${renderPredicted(blueSide.name)}`} src={blueSide.image} />
                    <div className={`team-name ${renderPredicted(blueSide.name)}`}>
                        {blueSide.name}
                    </div>
                </div>
                <div className="prediction-team-separator">
                    VS
                </div>
                <div className="prediction-team red-side" onClick={() => saveOrUpdatePrediction(redSide.name)}>
                <img className={`team-image ${renderPredicted(redSide.name)}`} src={redSide.image} />
                    <div className={`team-name ${renderPredicted(redSide.name)}`}>
                        {redSide.name}
                    </div>
                </div>
            </div>
            <div className="prediction-block"></div>
        </div>
    );
};
