import './prediction-leaderboard.scss';
import React, { useState, useEffect } from 'react';
import toPairs from 'lodash/toPairs';
import isEmpty from 'lodash/isEmpty';
import LoadingIndicator from '../../components/loading-indicator/loading-indicator.jsx';

const PredictionLeaderboard = props => {
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState([]);
    useEffect(() => {
        if (isEmpty(props.users) || isEmpty(props.predictionScoresByUser)) return;

        const sortedScores = toPairs(props.predictionScoresByUser)
            .map(([ userId, score ]) => {
                const user = props.users.find(user => user.id === userId);
                return {
                    id: user.id,
                    name: user.summonerName,
                    score
                };
            })
            .sort((val1, val2) => val2.score - val1.score);

        setLeaderboard(sortedScores);
        setLoading(false);
    }, [ props.users, props.predictionScoresByUser ]);

    const renderLoading = () => {
        <div className="loading-indicator">
            <LoadingIndicator />
        </div>
    };

    const renderLeaderboard = () => {
        
        return (
            <div className="leaderboard-wrapper">
                <table className="leaderboard-table">
                    <tbody>
                        {
                            leaderboard.map(score => {
                                const primaryCellClass = props.user.id === score.id
                                    ? 'personal-cell' : '';
                                return (
                                    <tr className="leaderboard-row" key={score.id}>
                                        <td className={`leaderboard-cell name-cell ${primaryCellClass}`}>
                                            {score.name}
                                        </td>
                                        <td className={`leaderboard-cell score-cell ${primaryCellClass}`}>
                                            {score.score}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    };

    return (
        <div className="prediction-leaderboard-wrapper">
            <div className="leaderboard-title">
                Leaderboard
            </div>
            {loading ? renderLoading() : renderLeaderboard()}
        </div>
    )
};

export default PredictionLeaderboard;
