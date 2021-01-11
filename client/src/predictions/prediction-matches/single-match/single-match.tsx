import './single-match.scss';
import React from 'react';
import { ScheduleMatch } from '../../../types/pro-play-metadata';
import connect from './single-match.connector';
import moment from 'moment';
import get from 'lodash/get';
import { Prediction } from '../../../types/predictions';

interface SingleMatchProps {
    matchMetadata: ScheduleMatch;
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
    const [redSide, blueSide] = matchMetadata.teams;
    const predictionsByUser = predictionMap[userId];
    const prediction = predictionsByUser ? predictionsByUser[matchMetadata.id] : null;
    const current = moment();
    const matchMoment = moment(matchMetadata.startTime);
    const hasGameStarted = current.isAfter(matchMoment);

    const renderTeamBlock = (team) => {
        const isPredictedLoser = !!prediction && prediction.prediction !== team.name;

        const predictionObj: Prediction = {
            prediction: team.name,
            timestamp: current.valueOf(),
            matchId: matchMetadata.id,
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
