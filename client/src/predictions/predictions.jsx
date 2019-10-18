import React from 'react';
import PredictionMatch from './prediction-match/prediction-match.jsx';
import PredictionFilters from './prediction-filters/prediction-filters.container.jsx';
import isEmpty from 'lodash/isEmpty';

export default class Predictions extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            userSelections: {
                0: 'SK Telecom T1'
            }
        };

        this.fetchData = this.fetchData.bind(this);
        this.renderMatches = this.renderMatches.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.onPredictionClick = this.onPredictionClick.bind(this);
    }

    fetchData () {
        this.props.fetchMatches();
        this.props.fetchUserPredictions();
    }

    onPredictionClick ({ name, index }) {
        this.props.updateUserPredictions({
            ...this.props.userPredictions,
            ...{ [index]: name }
        });
    }

    renderMatches () {
        return (
            <div className="prediction-matches-wrapper">
                {
                    this.props.matches[0].matches.map((match, index) => {
                        return (
                            <PredictionMatch
                                key={index}
                                index={index}
                                predicted={this.props.userPredictions[index]}
                                redSide={match.redSide}
                                blueSide={match.blueSide}
                                onPredictionClick={this.onPredictionClick} />
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
