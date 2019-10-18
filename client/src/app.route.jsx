import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import PrivateRoute from './components/private-route/private-route.container.jsx';
import Homepage from './homepage/homepage.jsx';
import LoginContainer from './login/login.container.jsx';
import RegisterContainer from './register/register.container.jsx';
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
                <Switch>
                    <PrivateRoute
                        path="/"
                        exact
                        component={Homepage} />
                    <Route
                        path="/login"
                        exact
                        component={LoginContainer} />
                    <Route
                        path="/register"
                        exact
                        component={RegisterContainer} />
                    <PrivateRoute
                        path="/predictions"
                        exact
                        userToken={this.state.userToken}
                        component={PredictionsContainer} />
                </Switch>
            </Router>
        );
    }
}

export default AppRoute;
