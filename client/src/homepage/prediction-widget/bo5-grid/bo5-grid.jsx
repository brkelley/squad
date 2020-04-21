import React from 'react';
import './bo5-grid.scss';

import moment from 'moment';
import toPairs from 'lodash/toPairs';
import isEqual from 'lodash/isEqual';

const Bo5Grid = ({ matches, usersMetadata, predictionMap }) => {
    const renderBo5TableHeaders = () => (
        <thead>
            <tr className="bo5-table-row">
                <th className="bo5-table-cell header-cell" />
                {
                    matches.map(match => (
                        <th className="bo5-table-cell header-cell" key={match.id}>
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

    const renderBo5TableBody = () => (
        <tbody>
            {
                usersMetadata.map(user => {
                    let userScore = 0;
                    const currentTime = Date.now();
                    const firstMatchTime = moment(matches[0].matchTime).valueOf();
                    const showCurrentScores = (currentTime >= firstMatchTime);

                    return (
                        <tr className="bo5-table-row" key={user.id}>
                            <td className="bo5-table-cell row-label">
                                {user.summonerName}
                            </td>
                            {
                                matches.map(match => {
                                    const { league } = match;
                                    const userPrediction = predictionMap[league.id][user.id]
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
        teams
    }) => {
        if (!prediction) {
            return {
                score: 0,
                template: (
                    <td
                        className="prediction-table-cell image-cell"
                        key={id}>
                        <div className="prediction-answer-logo" />
                    </td>
                )
            };
        }

        const scoreObj = {
            [teams[0].name]: 0,
            [teams[1].name]: 0
        };
        const predictionArray = prediction.prediction.split(',');

        for (let i = 0; i < predictionArray.length; i++) {
            scoreObj[predictionArray[i]]++;
        }

        const winner = toPairs(scoreObj).reduce((winner, [teamName, score]) => {
            if (score > winner.score) {
                return { teamName, score };
            }
            return winner;
        }, { teamName: null, score: -1 });

        const winningTeam = teams.find(el => el.name === winner.teamName);

        let actualWinningTeam;
        let correctlyGuessedWinner = true;
        let correctlyGuessedScore = true;
        const containsTBD = teams.find(el => el.name === 'TBD');
        const showScore = !containsTBD && teams.find(el => el.result.gameWins === 3);

        if (!containsTBD && teams.find(el => el.result.gameWins === 3)) {
            actualWinningTeam = teams.find(el => el.result.gameWins === 3);
            correctlyGuessedWinner = winningTeam.name === actualWinningTeam.name;
            const actualScore = teams.map(el => el.result.gameWins).sort();
            const guessedScore = Object.values(scoreObj).sort();
            correctlyGuessedScore = isEqual(actualScore, guessedScore);
        }

        const template = winningTeam
            ? (
                <td
                    className="bo5-table-cell image-cell"
                    key={prediction.id}>
                    <div className={`bo5-image-score ${correctlyGuessedWinner ? '' : 'incorrect-prediction'}`}>
                        <img
                            src={winningTeam.image}
                            className={`prediction-logo ${''}`}
                        />
                        <div className={`series-score ${correctlyGuessedScore || !correctlyGuessedWinner ? '' : 'incorrect-prediction'}`}>
                            {Object.values(scoreObj).sort((a, b) => b - a).join('-')}
                        </div>
                    </div>
                </td>
            )
            : <td />;

        const score = (correctlyGuessedWinner ? 3 : 0) + (correctlyGuessedWinner && correctlyGuessedScore ? 2 : 0);

        return {
            score: showScore ? score : 0,
            template
        };
    };

    return (
        <div className="bo5-grid-wrapper">
            <table className="bo5-table">
                {renderBo5TableHeaders()}
                {renderBo5TableBody()}
            </table>
        </div>
    );
};

export default Bo5Grid;