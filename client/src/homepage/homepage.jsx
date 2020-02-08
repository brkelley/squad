import './homepage.scss';

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PredictionWidget from './prediction-widget/prediction-widget.jsx';
import get from 'lodash/get';
import moment from 'moment';

const Homepage = props => {
    return (
        <div className="homepage-wrapper">
            <PredictionWidget timespan="Week 4" />
            <PredictionWidget timespan="Week 3" />
            <PredictionWidget timespan="Week 2" />
            <PredictionWidget timespan="Week 1" />
        </div>
    );
};

const mapStateToProps = ({ predictionReducer, proPlayMetadataReducer }) => ({
    schedule: proPlayMetadataReducer.schedule,
    predictionFilters: predictionReducer.predictionFilters
});

const mapDispatchToProps = () => ({
    retrievePredictions: props => dispatch(retrievePredictions(props)),
    retrieveSchedule: () => dispatch(retrieveSchedule())
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
