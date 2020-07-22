import React, { useState } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import PrivateRoute from './components/private-route/private-route';
import Homepage from './homepage/homepage.tsx';
import Predictions from './predictions/predictions';
import UserDetails from './user-details/user-details.tsx';
import Login from './login/login.tsx';
import Register from './register/register.tsx';
import Redirect from './login/redirect/redirect';
import Navbar from './components/navbar/navbar.tsx';
import Header from './components/header/header.jsx';

const history = createBrowserHistory();

export default function AppRoute () {
    const routesWithoutNavbar = ['/login', '/auth/redirect', '/register'];
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
            <div className={`content-wrapper ${displayNavbar ? 'with-navbar' : ''}`}>
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
                        path="/login"
                        exact
                        component={Login} />
                    <Route
                        path="/auth/redirect"
                        exact
                        component={Redirect} />
                    <Route
                        path="/register"
                        exact
                        component={Register} />
                    <PrivateRoute
                        path="/predictions"
                        exact
                        component={Predictions} />
                </Switch>
            </div>
        </Router>
    );
}

