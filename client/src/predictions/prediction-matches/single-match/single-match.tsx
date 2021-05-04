import './single-match.scss';
import React from 'react';
import { MatchMetadata } from '../../../types/pro-play-metadata';
import connect from './single-match.connector';
import moment from 'moment';
import get from 'lodash/get';
import { Prediction } from '../../../types/predictions';

interface SingleMatchProps {
    matchMetadata: MatchMetadata;
    predictionMap: {
        [userId: string]: {
            [matchId: string]: Prediction
        }
    };
    userId: string;
    updatePrediction: Function;
};
const SingleMatch = ({
    matchMetadata,
    predictionMap,
    userId,
    updatePrediction
}: SingleMatchProps) => {
    const [redSide, blueSide] = matchMetadata.match.teams;
    const predictionsByUser = predictionMap[userId];
    const prediction = predictionsByUser ? predictionsByUser[matchMetadata.match.id] : null;
    const currentTimestamp = new Date().getTime();
    const matchStartTimestamp = new Date(matchMetadata.startTime).getTime();
    const hasGameStarted = currentTimestamp > matchStartTimestamp;

    const renderTeamBlock = (team) => {
        const isPredictedLoser = !!prediction && prediction.prediction !== team.name;

        const predictionObj: Prediction = {
            prediction: team.name,
            timestamp: currentTimestamp,
            matchId: matchMetadata.match.id,
            userId
        };

        if (prediction && prediction.id) {
            predictionObj.id = prediction.id;
        }

        const predictionFunction = hasGameStarted
            ? () => {}
            : () => updatePrediction(predictionObj);

        return (
            <div
                className={`team-container ${!hasGameStarted ? 'saveable' : ''}`}
                onClick={predictionFunction}>
                <div className={`team-image-container ${isPredictedLoser ? 'losing-team' : ''}`}>
                    <img
                        className="team-image"
                        src={team.image} />
                </div>
                <div className={`team-name ${isPredictedLoser ? 'losing-team' : ''}`}>
                    {team.name}
                </div>
            </div>
        );
    };

    return (
        <div className="single-match">
            <div className="team-start-time">
                {moment(matchMetadata.startTime).format('h:mm a')}
            </div>
            <div className="match-main-content">
                {renderTeamBlock(redSide)}
                <div className="match-vs-separator">
                    VS
                </div>
                {renderTeamBlock(blueSide)}
            </div>
            <div className="team-start-time"></div>
        </div>
    );
};

export default connect(SingleMatch);
