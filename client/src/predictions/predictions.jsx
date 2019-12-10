import React from 'react';
import PredictionMatch from './prediction-match/prediction-match.jsx';
import PredictionFilters from './prediction-filters/prediction-filters.container.jsx';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import get from 'lodash/get';

export default class Predictions extends React.Component {
    constructor (props) {
        super(props);

        this.fetchData = this.fetchData.bind(this);
        this.renderMatches = this.renderMatches.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.onPredictionClick = this.onPredictionClick.bind(this);
        this.renderDailyMatchesWrapper = this.renderDailyMatchesWrapper.bind(this);
    }

    fetchData () {
        this.props.fetchMatches();
        this.props.fetchUserPredictions();
        this.props.fetchMatchResults();
    }

    onPredictionClick ({ name, time }) {
        const fcn = isEmpty(this.props.userPredictions) ? this.props.createUserPredictions : this.props.updateUserPredictions;
        fcn({
            ...this.props.userPredictions,
            ...{ [time]: name }
        });
    }

    renderDailyMatchesWrapper (matchDay, dayIndex) {
        return (
            <div className="prediction-matches-wrapper">
                <div className="matches-day-header">
                    {moment(matchDay[dayIndex].time).format('MMMM D')}
                </div>
                {
                    matchDay.map((match, index) => {
                        const results = get(this.props.matchResults, `results.${match.time}`);
                        return this.props.userPredictions && (
                            <PredictionMatch
                                key={index}
                                predicted={this.props.userPredictions[match.time]}
                                results={results}
                                redSide={match.redSide}
                                blueSide={match.blueSide}
                                time={match.time}
                                bestOf={match.bestOf}
                                onPredictionClick={this.onPredictionClick} />
                        )
                    })
                }
            </div>
        );
    }

    renderMatches () {
        return values(this.props.matches).map((matchDay, index) => this.renderDailyMatchesWrapper(matchDay, index))
    }

    renderLoading () {
        return <div>Loading</div>;
    }

    render () {
        return (
            <div className="prediction-wrapper">
                <div className="predictions-header">
                    <div className="prediction-title">
                        Predictions
                    </div>
                    <PredictionFilters
                        filters={this.props.filters}
                        onValidFilters={this.fetchData} />

                </div>
                {(this.props.fetching || isEmpty(this.props.matches)) ? this.renderLoading() : this.renderMatches()}
            </div>
        );
    }
}
