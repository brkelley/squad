import './active-split-widget.scss';
import React from 'react';
import { calculateUserSplitStatistics } from './active-split-widget.helper.js';
import { convertNumberToCardinal } from '../../utils/common.util';

const ActiveSplitWidget = ({ users, user, predictionMap, schedule }) => {
    const {
        score,
        placement,
        mostPredicted,
        mostWon,
        blindspot,
        leaderboard
    } = calculateUserSplitStatistics({ users, schedule, predictionMap });
    const renderLeaderboard = () => {
        return (
            <div className="leaderboard-wrapper">
                {leaderboard.map((boardEntry) => (
                    <div
                        className={`board-entry ${(boardEntry.id === user.id) ? 'active-user' : ''}`}
                        key={boardEntry.id}>
                        <div className="board-name">
                            {boardEntry.name}
                        </div>
                        <div className="board-score">
                            {boardEntry.score}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="active-split-widget-wrapper">
            <div className="primary-split-stats">
                <div className="primary-split-stat split-title">
                    Summer 2020
                </div>
                <div className="primary-split-stat split-placement">
                    {convertNumberToCardinal(placement)}
                </div>
                <div className="primary-split-stat split-score">
                    {score} points
                </div>
            </div>
            <div className="secondary-split-stats">
                <div className="secondary-split-stat image-stat">
                    <img
                        className="stat-logo"
                        src={mostPredicted.image} />
                    <div className="stat-label">
                        most predicted
                    </div>
                </div>
                <div className="secondary-split-stat image-stat">
                    <img
                        className="stat-logo"
                        src={mostWon.image} />
                    <div className="stat-label">
                        most won
                    </div>
                </div>
                <div className="secondary-split-stat image-stat">
                    <img
                        className="stat-logo"
                        src={blindspot.image} />
                    <div className="stat-label">
                        blindspot
                    </div>
                </div>
            </div>
            <div className="leaderboard-border"></div>
            {renderLeaderboard()}
        </div>
    );
    // const [loading, setLoading] = useState(true);
    // const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    // const [mostPredicted, setMostPredicted] = useState<TeamStat>();
    // const [mostWins, setMostWins] = useState({});
    // const [mostLosses, setMostLosses] = useState({});

    // useEffect(() => {
    //     setLoading(true);
    //     if (!isEmpty(users) && !isEmpty(predictionMap) && !isEmpty(schedule)) {
    //         // const { leaderboard, mostPredicted, mostWins, mostLosses } = calculateScores({
    //         //     users,
    //         //     schedule,
    //         //     predictionMap,
    //         //     userId: user.id
    //         // });
    //         // setLeaderboard(leaderboard);
    //         // setMostPredicted(mostPredicted);
    //         // setMostWins(mostWins);
    //         // setMostLosses(mostLosses);
    //         // setLoading(false);
    //     }
    // }, [users, predictionMap, schedule]);

    // const renderLoading = () => (
    //     <div className="loading-indicator">
    //         <LoadingIndicator />
    //     </div>
    // );

    // const renderLeaderboard = () => (
    //     <div className="leaderboard-wrapper">
    //         <table className="leaderboard-table">
    //             <tbody>
    //                 {
    //                     leaderboard.map(score => {
    //                         const primaryCellClass = user.id === score.id
    //                             ? 'personal-cell' : '';
    //                         return (
    //                             <tr className="leaderboard-row" key={score.id}>
    //                                 <td className={`leaderboard-cell name-cell ${primaryCellClass}`}>
    //                                     {score.name}
    //                                 </td>
    //                                 <td className={`leaderboard-cell score-cell ${primaryCellClass}`}>
    //                                     {score.score}
    //                                 </td>
    //                             </tr>
    //                         );
    //                     })
    //                 }
    //             </tbody>
    //         </table>
    //     </div>
    // );

    // const renderMostPredicted = () => (
    //     <div className="statistic-wrapper most-predicted-wrapper">
    //         <div className="statistic-title">
    //             Most Predicted
    //         </div>
    //         <hr className="separator" />
    //         <img className="statistic-team-logo" src={mostPredicted.teamMetadata.image} />
    //         <div className="statistic-information team-name">
    //             {mostPredicted.teamMetadata.name}
    //         </div>
    //         <div className="statistic-information statistic">
    //             {`${mostPredicted.count} picks`}
    //         </div>
    //     </div>
    // );

    // const renderMostWins = () => (
    //     <div className="statistic-wrapper most-predicted-wrapper">
    //         <div className="statistic-title">
    //             Most Wins
    //         </div>
    //         <hr className="separator" />
    //         <img className="statistic-team-logo" src={mostWins.teamMetadata.image} />
    //         <div className="statistic-information team-name">
    //             {mostWins.teamMetadata.name}
    //         </div>
    //         <div className="statistic-information statistic">
    //             {`${mostWins.winLoss.win} wins`}
    //         </div>
    //     </div>
    // );

    // const renderMostLosses = () => (
    //     <div className="statistic-wrapper most-predicted-wrapper">
    //         <div className="statistic-title">
    //             Most Losses
    //         </div>
    //         <hr className="separator" />
    //         <img className="statistic-team-logo" src={mostLosses.teamMetadata.image} />
    //         <div className="statistic-information team-name">
    //             {mostLosses.teamMetadata.name}
    //         </div>
    //         <div className="statistic-information statistic">
    //             {`${mostLosses.winLoss.loss} losses`}
    //         </div>
    //     </div>
    // );

    // return (
    //     <div className="prediction-leaderboard-wrapper">
    //         {loading ? renderLoading() : renderLeaderboard()}
    //         {loading ? '' : renderMostPredicted()}
    //         {loading ? '' : renderMostWins()}
    //         {loading ? '' : renderMostLosses()}
    //     </div>
    // );
};

export default ActiveSplitWidget;
