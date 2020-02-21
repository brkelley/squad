import './prediction-analytics.scss';
import React, { useState, useEffect } from 'react';
import LoadingIndicator from '../../components/loading-indicator/loading-indicator.jsx';
import { calculateScores } from './prediction-analytics.helper.js';
import isEmpty from 'lodash/isEmpty';

const PredictionLeaderboard = props => {
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState([]);
    const [mostPredicted, setMostPredicted] = useState({});
    const [mostWins, setMostWins] = useState({});
    const [mostLosses, setMostLosses] = useState({});

    useEffect(() => {
        setLoading(true);
        if (!isEmpty(props.users) && !isEmpty(props.predictionMap) && !isEmpty(props.schedule)) {
            const scores = calculateScores({
                users: props.users,
                schedule: props.schedule,
                predictionMap: props.predictionMap,
                userId: props.user.id
            });
            setLeaderboard(scores.leaderboard);
            setMostPredicted(scores.mostPredicted);
            setMostWins(scores.mostWins);
            setMostLosses(scores.mostLosses);
            setLoading(false);
        }
        
    }, [ props.users, props.predictionMap, props.schedule ]);

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

    const renderMostPredicted = () => {
        return (
            <div className="statistic-wrapper most-predicted-wrapper">
                <div className="statistic-title">
                    Most Predicted
                </div>
                <hr className="separator" />
                <img className="statistic-team-logo" src={mostPredicted.teamMetadata.image} />
                <div className="statistic-information team-name">
                    {mostPredicted.teamMetadata.name}
                </div>
                <div className="statistic-information statistic">
                    {mostPredicted.count} picks
                </div>
            </div>
        );
    };

    const renderMostWins = () => {
        return (
            <div className="statistic-wrapper most-predicted-wrapper">
                <div className="statistic-title">
                    Most Wins
                </div>
                <hr className="separator" />
                <img className="statistic-team-logo" src={mostWins.teamMetadata.image} />
                <div className="statistic-information team-name">
                    {mostWins.teamMetadata.name}
                </div>
                <div className="statistic-information statistic">
                    {mostWins.winLoss.win} wins
                </div>
            </div>
        );
    };

    const renderMostLosses = () => {
        return (
            <div className="statistic-wrapper most-predicted-wrapper">
                <div className="statistic-title">
                    Most Losses
                </div>
                <hr className="separator" />
                <img className="statistic-team-logo" src={mostLosses.teamMetadata.image} />
                <div className="statistic-information team-name">
                    {mostLosses.teamMetadata.name}
                </div>
                <div className="statistic-information statistic">
                    {mostLosses.winLoss.loss} losses
                </div>
            </div>
        );
    };

    return (
        <div className="prediction-leaderboard-wrapper">
            {loading ? renderLoading() : renderLeaderboard()}
            {loading ? '' : renderMostPredicted()}
            {loading ? '' : renderMostWins()}
            {loading ? '' : renderMostLosses()}
        </div>
    )
};

export default PredictionLeaderboard;
