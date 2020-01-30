import './homepage.scss';

import React from 'react';
import PredictionWidget from './prediction-widget/prediction-widget.jsx';

export default function Homepage () {
    return (
        <div className="homepage-wrapper">
            <PredictionWidget timespan="Week 2" />
            <PredictionWidget timespan="Week 1" />
        </div>
    );
};
