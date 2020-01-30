import './prediction-match.scss';

import React from 'react';
import get from 'lodash/get';
import moment from 'moment';

export default function PredictionMatch (props) {
    const [blueSide, redSide] = props.matchMetadata.match.teams;

    const predictionMetadata = get(props, 'prediction');
    const predictionId = get(predictionMetadata, 'id');
    const predictedTeam = get(predictionMetadata, 'prediction');

    const renderPredicted = (teamName) => {
        if (predictedTeam && teamName !== predictedTeam) {
            return 'not-predicted';
        }
    };

    const saveOrUpdatePrediction = async team => {
        if (predictedTeam === team) return;

        const getNow = Date.now();
        const matchTime = moment(props.matchMetadata.startTime).valueOf();

        if (getNow >= matchTime) return;

        const body = {
            ...predictionId && { id: predictionId },
            userId: props.userId,
            matchId: props.matchMetadata.match.id,
            prediction: team,
            leagueId: props.leagueId,
            matchTime: props.matchMetadata.startTime
        };

        props.updatePrediction(body);
    };

    const renderTeamBlock = team => {
        const getNow = Date.now();
        const matchTime = moment(props.matchMetadata.startTime).valueOf();
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

    return (
        <div className="prediction-match-wrapper">
            <div className="prediction-block">
                {moment(props.matchMetadata.startTime).format('h:mm A')}
            </div>
            <div className="prediction-content">
                {renderTeamBlock(blueSide)}
                <div className="prediction-team-separator">
                    VS
                </div>
                {renderTeamBlock(redSide)}
            </div>
            <div className="prediction-block"></div>
        </div>
    );
};
