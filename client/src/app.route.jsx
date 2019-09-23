import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Homepage from './homepage/homepage.jsx';
import PredictionsContainer from './predictions/predictions.container.jsx';

const history = createBrowserHistory();

export default function AppRoute () {
    return (
        <Router history={history}>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/predictions" component={PredictionsContainer} />
        </Router>
    );
}
