import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import PrivateRoute from './components/private-route/private-route.jsx';
import Homepage from './homepage/homepage.jsx';
import LoginContainer from './login/login.container.jsx';
import PredictionsContainer from './predictions/predictions.container.jsx';

const history = createBrowserHistory();

class AppRoute extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            userToken: props.store.getState().userReducer.userToken
        }
    }

    render () {
        return (
            <Router history={history}>
                <Route
                    exact
                    path="/"
                    component={Homepage} />
                <Route
                    exact
                    path="/login"
                    component={LoginContainer} />
                <PrivateRoute
                    exact
                    path="/predictions"
                    userToken={this.state.userToken}
                    component={PredictionsContainer} />
            </Router>
        );
    }
}

export default AppRoute;
