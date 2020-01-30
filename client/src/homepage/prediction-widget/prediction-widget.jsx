import { getAllUsers } from '../../store/user/user.actions.js';
import { retrievePredictions } from '../../store/predictions/predictions.actions.js';
import { retrieveSchedule } from '../../store/pro-play-metadata/pro-play-metadata.actions.js';

import './prediction-widget.scss';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import LoadingIndicator from '../../components/loading-indicator/loading-indicator.jsx';
import LEAGUES_METADATA from '../../../../constants/leagues.json';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';

const PredictionWidget = props => {
    const [predictionsLoading, setPredictionsLoading] = useState(false);

    const retrievePredictions = async () => {
        if (!isEmpty(props.predictionMap) || predictionsLoading) return;

        setPredictionsLoading(true);
        try {
            await props.getAllUsers();
            await props.retrievePredictions({ forceReload: false });
            await props.retrieveSchedule();
        } catch (error) {
            console.error(error);
        }

        setPredictionsLoading(false);
    };

    retrievePredictions();

    const retrieveCurrentMatches = () => {
        // For now, only load Week 1
        return flatMap(Object.values(props.schedule)).filter(el => el.blockName === props.timespan).map(match => {
            return {
                ...match.match,
                league: LEAGUES_METADATA.find(league => league.name === match.league.name),
                startTime: match.startTime
            };
        });
    }

    const renderPredictionTableHeader = (matches) => {
        return (
            <thead>
                <tr className="prediction-table-row">
                    <th className="prediction-table-cell header-cell"></th>
                    {
                        matches.map(match => {
                            return (
                                <th className="prediction-table-cell header-cell" key={match.id}>
                                    <div className="header-team-name">{match.teams[0].code}</div>
                                    <div className="header-vs">vs</div>
                                    <div className="header-team-name">{match.teams[1].code}</div>
                                </th>
                            );
                        })
                    }
                </tr>
            </thead>
        );
    };

    const renderPredictionCell = (prediction, teams, matchTime) => {
        if (!prediction) {
            return (
                <td className="prediction-table-cell image-cell">
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
        if (!predictionOccurred) showCurrentUserTotals = false;

        if (!prediction || !predictionOccurred) {}
        else if (get(predictedTeam, 'result.gameWins') === 1) {
            currentUserTotals++;
        } else {
            addClass = ' incorrect-prediction';
        }

        return (
            <td className="prediction-table-cell image-cell" key={prediction.id}>
                <img src={predictedTeam.image} className={`prediction-answer-logo${addClass}`} />
            </td>
        );
    };

    let currentUserTotals = 0;
    let showCurrentUserTotals = true;
    const renderPredictionBody = matches => {
        return (
            <tbody>
                {
                    props.usersMetadata.map(user => {
                        currentUserTotals = 0;
                        return (
                            <tr className="prediction-table-row" key={user.id}>
                                <td className="prediction-table-cell row-header">
                                    {user.summonerName}
                                </td>
                                {
                                    matches.map(match => {
                                        const { league } = match;
                                        const userPrediction = props.predictionMap[league.id][user.id].find(pred => pred.matchId === match.id);
                                        return renderPredictionCell(userPrediction, match.teams, match.startTime);
                                    })
                                }
                                <td className="prediction-table-cell totals-cell">
                                    {
                                        showCurrentUserTotals ? <span>{currentUserTotals}</span> : ''
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

    if (predictionsLoading) {
        return (
            <div className="prediction-widget-wrapper">
                <div className="predictions-loading">
                    <LoadingIndicator />
                </div>
            </div>
        );
    }

    return (
        <div className="prediction-widget-wrapper">
            <div className="block-title">
                {props.timespan}
            </div>
            {renderPredictionOverview()}
        </div>
    );

};

const mapStateToProps = ({ userReducer, predictionReducer, proPlayMetadataReducer }) => ({
    usersMetadata: userReducer.usersMetadata,
    schedule: proPlayMetadataReducer.schedule,
    predictionMap: predictionReducer.predictionMap,
});

const mapDispatchToProps = dispatch => ({
    getAllUsers: () => dispatch(getAllUsers()),
    retrievePredictions: props => dispatch(retrievePredictions(props)),
    retrieveSchedule: () => dispatch(retrieveSchedule())
});

export default connect(mapStateToProps, mapDispatchToProps)(PredictionWidget);
