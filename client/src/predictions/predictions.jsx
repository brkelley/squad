import React, { Component } from 'react';
import PredictionMatch from './prediction-match/prediction-match.jsx';
import isEmpty from 'lodash/isEmpty';

export default class Predictions extends Component {
    constructor (props) {
        super(props);

        this.props.fetchMatches();

        this.renderPredictionsFilters = this.renderPredictionsFilters.bind(this);
        this.renderMatches = this.renderMatches.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
    }

    renderPredictionsFilters () {
        return (
            <div className="predictions-filters-wrapper">
                <div className="prediction-section">Play-ins - Group Stage</div>
            </div>
        );
    }

    renderMatches () {
        return (
            <div className="prediction-matches-wrapper">
                {
                    this.props.matches.matches.day1.games.map(match => {
                        return (
                            <PredictionMatch
                                redSide={match.team1}
                                blueSide={match.team2} />
                        )
                    })
                }
            </div>
        );
    }

    renderLoading () {
        return <div>Loading</div>;
    }

    render () {
        return (
            <div className="prediction-wrapper">
                <div className="prediction-title">
                    Predictions
                </div>
                {this.renderPredictionsFilters()}
                {(this.props.fetching || isEmpty(this.props.matches)) ? this.renderLoading() : this.renderMatches()}
            </div>
        );
    }
}
