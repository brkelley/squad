import React, { useState } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import PrivateRoute from './components/private-route/private-route.container.jsx';
import Homepage from './homepage/homepage.jsx';
import PredictionsContainer from './predictions/predictions.container.jsx';
import WelcomeContainer from './welcome/welcome.container.jsx';
import TopNavbar from './components/top-navbar/top-navbar.jsx';

const history = createBrowserHistory();

export default function AppRoute (props) {
    const [username] = useState(props.store.getState().userReducer.userToken);
    const [displayNavbar, setDisplayNavbar] = useState(!['/login', '/register', '/spectate'].includes(history.location.pathname));

    history.listen(location => {
        setDisplayNavbar(!['/login', '/register', '/spectate'].includes(location.pathname));
    });

    return (
        <Router history={history}>
            {displayNavbar && <TopNavbar />}
            <Switch>
                <PrivateRoute
                    path="/"
                    exact
                    component={Homepage} />
                <Route
                    path="/login"
                    exact
                    component={WelcomeContainer} />
                <Route
                    path="/register"
                    exact
                    component={WelcomeContainer} />
                <Route
                    path="/spectate"
                    exact
                    component={WelcomeContainer} />
                <PrivateRoute
                    path="/predictions"
                    exact
                    userToken={username}
                    component={PredictionsContainer} />
                <Route
                    path="/welcome"
                    exact
                    component={WelcomeContainer} />
            </Switch>
        </Router>
    );
}

