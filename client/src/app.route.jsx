import React, { useState } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import PrivateRoute from './components/private-route/private-route.jsx';
import Homepage from './homepage/homepage.jsx';
import PredictionsContainer from './predictions/predictions.jsx';
import UserDetails from './user-details/user-details.jsx';
import Welcome from './welcome/welcome.tsx';
import Navbar from './components/navbar/navbar.jsx';
import Header from './components/header/header.jsx';

const history = createBrowserHistory();

export default function AppRoute () {
    const routesWithoutNavbar = ['/login', '/register', '/spectate', '/reset-password'];
    const [displayNavbar, setDisplayNavbar] = useState(!routesWithoutNavbar.includes(history.location.pathname));

    history.listen(location => {
        setDisplayNavbar(!routesWithoutNavbar.includes(location.pathname));
    });

    const renderHeader = () => {
        if (displayNavbar) return <Header />;
    };

    const renderNavbar = () => {
        if (displayNavbar) {
            return (
                <div className="navbar-sticky">
                    <Navbar history={history} />
                </div>
            );
        }
    };

    return (
        <Router history={history}>
            {renderNavbar()}
            <div className="content-wrapper">
                {renderHeader()}
                <Switch>
                    <PrivateRoute
                        path="/users/:summonerName"
                        exact
                        component={UserDetails} />
                    <PrivateRoute
                        path="/"
                        exact
                        component={Homepage} />
                    <Route
                        path="/welcome"
                        exact
                        component={Welcome} />
                    <Route
                        path="/login"
                        exact
                        component={Welcome} />
                    <Route
                        path="/register"
                        exact
                        component={Welcome} />
                    <Route
                        path="/spectate"
                        exact
                        component={Welcome} />
                    <Route
                        path="/reset-password"
                        exact
                        component={Welcome} />
                    <PrivateRoute
                        path="/predictions"
                        exact
                        component={PredictionsContainer} />
                </Switch>
            </div>
        </Router>
    );
}

