import './prediction-widget.scss';
import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '../../components/loading-indicator/loading-indicator.jsx';
import ErrorIndicator from '../../components/error-indicator/error-indicator.jsx';
import LEAGUES_METADATA from '../../../../constants/leagues.json';
import moment from 'moment';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';

const PredictionWidget = props => {
    const retrieveCurrentMatches = () => {
        return flatMap(Object.values(props.schedule)).filter(el => el.blockName === props.timespan).map(match => {
            return {
                ...match.match,
                league: LEAGUES_METADATA.find(league => league.name === match.league.name),
                startTime: match.startTime,
                state: match.state
            };
        });
    };

    const saveAndRenderScore = (userId, score) => {
        props.updatePredictionScore(userId, score);
        return <span>{score}</span>;
    };

    const renderPredictionTableHeader = (matches) => {
        return (
            <thead>
                <tr className="prediction-table-row">
                    <th className="prediction-table-cell header-cell"></th>
                    {
                        matches.map(match => {
                            return (
                                <th className="prediction-table-cell header-cell" key={match.id}>
                                    <div className="header-team-name">{match.teams ? match.teams[0].code : ''}</div>
                                    <div className="header-vs">vs</div>
                                    <div className="header-team-name">{match.teams ? match.teams[1].code : ''}</div>
                                </th>
                            );
                        })
                    }
                </tr>
            </thead>
        );
    };

    const renderPredictionCell = ({ id, userId, prediction, teams, matchTime, matchState }) => {
        if (!prediction) {
            return (
                <td
                    className="prediction-table-cell image-cell"
                    key={id}>
                    <div className="prediction-answer-logo"></div>
                </td>
            );
        }
        const predictedTeam = teams.find(el => {
            if (prediction.prediction === 'Hundred Thieves') prediction.prediction = '100 Thieves';
            if (el.name === 'Hundred Thieves') el.name = '100 Thieves';
            return el.name === prediction.prediction;
        });
        let addClass = '';

        const getNow = Date.now();
        const matchTimeAsEpoch = moment(matchTime).valueOf();

        const predictionOccurred = (getNow >= matchTimeAsEpoch);
        if (predictionOccurred) showCurrentUserTotals = true;

        if (!prediction || !predictionOccurred || matchState === 'inProgress') {}
        else if (get(predictedTeam, 'result.gameWins') === 1) {
            if (!currentUserTotals[userId]) currentUserTotals[userId] = 0;
            currentUserTotals[userId]++;
        } else {
            addClass = ' incorrect-prediction';
        }

        return (
            <td className="prediction-table-cell image-cell" key={prediction.id}>
                <img src={predictedTeam.image} className={`prediction-answer-logo${addClass}`} />
            </td>
        );
    };

    let currentUserTotals = {};
    let showCurrentUserTotals = false;
    const renderPredictionBody = matches => {
        return (
            <tbody>
                {
                    props.usersMetadata.map(user => {
                        return (
                            <tr className="prediction-table-row" key={user.id}>
                                <td className="prediction-table-cell row-header">
                                    {user.summonerName}
                                </td>
                                {
                                    matches.map(match => {
                                        const { league } = match;
                                        const userPrediction = props.predictionMap[league.id][user.id].find(pred => pred.matchId === match.id);
                                        return renderPredictionCell({
                                            id: match.id,
                                            userId: user.id,
                                            prediction: userPrediction,
                                            teams: match.teams,
                                            matchTime: match.startTime,
                                            matchState: match.state
                                        });
                                    })
                                }
                                <td className="prediction-table-cell totals-cell">
                                    {
                                        showCurrentUserTotals ? saveAndRenderScore(user.id, currentUserTotals[user.id]) : ''
                                    }
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        );
    };

    const renderPredictionOverview = () => {
        const matches = retrieveCurrentMatches();
        return (
            <div className="prediction-content">
                <table className="prediction-table">
                    {renderPredictionTableHeader(matches)}
                    {renderPredictionBody(matches)}
                </table>
            </div>
        )
    };

    // if (predictionsError) {
    //     return (
    //         <div className="prediction-widget-wrapper">
    //             <div className="predictions-error-message">
    //                 <ErrorIndicator />
    //             </div>
    //         </div>
    //     );
    // };

    if (props.scheduleFetching) {
        return (
            <div className="prediction-widget-wrapper">
                <div className="predictions-loading">
                    <LoadingIndicator />
                </div>
            </div>
        );
    };

    return (
        <div className="prediction-widget-wrapper">
            <div className="block-title">
                {props.timespan}
            </div>
            {renderPredictionOverview()}
        </div>
    );

};

import { updatePredictionScore } from '../../store/predictions/predictions.actions.js';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    updatePredictionScore: (userId, predictionAddition) => dispatch(updatePredictionScore(userId, predictionAddition))
});

export default connect(mapStateToProps, mapDispatchToProps)(PredictionWidget);
