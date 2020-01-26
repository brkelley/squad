import './prediction-widget.scss';

import React, { useState } from 'react';
import axios from 'axios';

export default function PredictionWidget (props) {
    const [predictions, setPredictions] = useState([]);

    const retrievePredictions = async () => {
        if (predictions.length > 0) {
            return;
        }
        const data = await axios.get('/predictions?leagueId=98767991302996019&all=true');
        setPredictions(data.data);
    };

    retrievePredictions();

    return (
        <div className="prediction-widget-wrapper">
            
        </div>
    );
};
