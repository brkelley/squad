import './prediction-analytics.scss';
import React, { useState, useEffect } from 'react';
import LoadingIndicator from '../../components/loading-indicator/loading-indicator.jsx';
import calculateScores from './prediction-analytics.helper.js';
import isEmpty from 'lodash/isEmpty';

const PredictionLeaderboard = ({ users, user, predictionMap, schedule }) => {
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState([]);
    const [mostPredicted, setMostPredicted] = useState({});
    const [mostWins, setMostWins] = useState({});
    const [mostLosses, setMostLosses] = useState({});

    useEffect(() => {
        setLoading(true);
        if (!isEmpty(users) && !isEmpty(predictionMap) && !isEmpty(schedule)) {
            const scores = calculateScores({
                users,
                schedule,
                predictionMap,
                userId: user.id
            });
            setLeaderboard(scores.leaderboard);
            setMostPredicted(scores.mostPredicted);
            setMostWins(scores.mostWins);
            setMostLosses(scores.mostLosses);
            setLoading(false);
        }
    }, [users, predictionMap, schedule]);

    const renderLoading = () => (
        <div className="loading-indicator">
            <LoadingIndicator />
        </div>
    );

    const renderLeaderboard = () => (
        <div className="leaderboard-wrapper">
            <table className="leaderboard-table">
                <tbody>
                    {
                        leaderboard.map(score => {
                            const primaryCellClass = user.id === score.id
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
    );

    const renderMostPredicted = () => (
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
                {`${mostPredicted.count} picks`}
            </div>
        </div>
    );

    const renderMostWins = () => (
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
                {`${mostWins.winLoss.win} wins`}
            </div>
        </div>
    );

    const renderMostLosses = () => (
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
                {`${mostLosses.winLoss.loss} losses`}
            </div>
        </div>
    );

    return (
        <div className="prediction-leaderboard-wrapper">
            {loading ? renderLoading() : renderLeaderboard()}
            {loading ? '' : renderMostPredicted()}
            {loading ? '' : renderMostWins()}
            {loading ? '' : renderMostLosses()}
        </div>
    );
};

export default PredictionLeaderboard;
