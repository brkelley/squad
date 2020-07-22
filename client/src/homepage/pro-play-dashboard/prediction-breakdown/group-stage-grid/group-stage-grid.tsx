import React from 'react';
import './group-stage-grid.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import get from 'lodash/get';
import { Prediction } from '../../../../types/predictions';

const GroupStageGrid = ({ label = '', matches, usersMetadata, predictionMap }) => {
    if (matches.length === 0) {
        return <></>;
    }

    const renderGroupStageTableHeaders = () => (
        <thead>
            <tr className="group-stage-table-row">
                <th className="group-stage-table-cell header-cell" />
                {
                    matches
                        .sort((a, b) => ((new Date(a.startTime).getTime()) - new Date(b.startTime).getTime()))
                        .map(match => {
                            if (!match || !match.match.teams) return null;
                            return (
                                <th
                                    className="group-stage-table-cell header-cell"
                                    key={match.match.id}>
                                    <div className="header-team-name">
                                        {match.match.teams[0].code}
                                    </div>
                                    <div className="header-vs">vs</div>
                                    <div className="header-team-name">
                                        {match.match.teams[1].code}
                                    </div>
                                </th>
                            )
                        })
                }
            </tr>
        </thead>
    );

    const renderGroupStageTableBody = () => (
        <tbody>
            {
                usersMetadata.map(user => {
                    let userScore = 0;
                    const currentTime = Date.now();
                    const firstMatchTime = moment(matches[0].startTime).valueOf();
                    const showCurrentScores = (currentTime >= firstMatchTime);

                    return (
                        <tr className="group-stage-table-row" key={user.id}>
                            <td className="group-stage-table-cell row-label">
                                {user.summonerName}
                            </td>
                            {
                                matches
                                    .sort((a, b) => ((new Date(a.startTime).getTime()) - new Date(b.startTime).getTime()))
                                    .map(match => {
                                        if (!match || !match.match.teams) return null;
                                        const userPredictions = get(predictionMap, `${user.id}`, {});
                                        const userPrediction = Object.values(userPredictions)
                                            .find((pred: Prediction) => pred.matchId === match.match.id);

                                        const { score, template } = renderPredictionCell({
                                            id: match.match.id,
                                            prediction: userPrediction,
                                            teams: match.match.teams,
                                            matchTime: match.startTime,
                                            matchState: match.state
                                        });
                                        userScore += score;

                                        return template;
                                    })
                            }
                            <td className="prediction-table-cell totals-cell">
                                {showCurrentScores ? userScore : ''}
                            </td>
                        </tr>
                    );
                })
            }
        </tbody>
    );

    const renderPredictionCell = ({
        id,
        prediction,
        teams,
        matchTime,
        matchState
    }) => {
        let score = 0;
        if (!prediction) {
            const noPrediction = (
                <FontAwesomeIcon
                    className="missing-prediction-icon"
                    icon={faTimes} />
            );

            return {
                score: 0,
                template: (
                    <td
                        className="group-stage-table-cell image-cell"
                        key={id}>
                        <div className="prediction-answer-logo">
                            {matchState === 'completed' ? noPrediction : ''}
                        </div>
                    </td>
                )
            };
        }

        let addClass = '';
        const currentTime = Date.now();
        const matchTimeAsEpoch = moment(matchTime).valueOf();

        const predictedTeam = teams.find(el => el.name === prediction.prediction);

        const predictionOccurred = (currentTime >= matchTimeAsEpoch);

        if (prediction && predictionOccurred && matchState !== 'inProgress') {
            if (get(predictedTeam, 'result.gameWins') === 1) {
                score++;
            } else {
                addClass = 'incorrect-prediction';
            }
        }

        return {
            score,
            template: (
                <td
                    className="group-stage-table-cell image-cell"
                    key={prediction.id}>
                    <img
                        src={predictedTeam.image}
                        className={`prediction-logo ${addClass}`}
                    />
                </td>
            )
        };
    };

    return (
        <div className="group-stage-wrapper">
            {label && <div className="group-stage-table-label">
                {label}
            </div>}
            <table className="group-stage-table">
                {renderGroupStageTableHeaders()}
                {renderGroupStageTableBody()}
            </table>
        </div>
    );
};

export default GroupStageGrid;
