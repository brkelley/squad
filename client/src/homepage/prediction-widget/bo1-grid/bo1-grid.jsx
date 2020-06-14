import React from 'react';
import './bo1-grid.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import get from 'lodash/get';

const Bo1Grid = ({ matches, usersMetadata, predictionMap }) => {
    const renderBo1TableHeaders = () => (
        <thead>
            <tr className="bo1-table-row">
                <th className="bo1-table-cell header-cell" />
                {
                    matches.map(match => (
                        <th className="bo1-table-cell header-cell" key={match.id}>
                            <div className="header-team-name">
                                {match.teams[0].code}
                            </div>
                            <div className="header-vs">vs</div>
                            <div className="header-team-name">
                                {match.teams[1].code}
                            </div>
                        </th>
                    ))
                }
            </tr>
        </thead>
    );

    const renderBo1TableBody = () => (
        <tbody>
            {
                usersMetadata.map(user => {
                    let userScore = 0;
                    const currentTime = Date.now();
                    const firstMatchTime = moment(matches[0].matchTime).valueOf();
                    const showCurrentScores = (currentTime >= firstMatchTime);

                    return (
                        <tr className="bo1-table-row" key={user.id}>
                            <td className="bo1-table-cell row-label">
                                {user.summonerName}
                            </td>
                            {
                                matches.map(match => {
                                    const { league } = match;
                                    const userPredictions = get(predictionMap, `${user.id}.${league.id}`, []);
                                    const userPrediction = userPredictions
                                        .find(pred => pred.matchId === match.id);
                                    
                                    const { score, template } = renderPredictionCell({
                                        id: match.id,
                                        prediction: userPrediction,
                                        teams: match.teams,
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
                        className="bo1-table-cell image-cell"
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
                    className="bo1-table-cell image-cell"
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
        <div className="bo1-grid-wrapper">
            <table className="bo1-table">
                {renderBo1TableHeaders()}
                {renderBo1TableBody()}
            </table>
        </div>
    );
};

export default Bo1Grid;
