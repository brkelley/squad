import './private-route.scss';
import React, { useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import LoadingIndicator from '../loading-indicator/loading-indicator.jsx';
import { validateFirebaseUser } from './private-route.util.js';

import { validateUserToken, logout } from '../../store/user/user.actions.js';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setShouldRedirect(rest.userToken && rest.userToken === 'INVALID');
        setLoading(false);
    }, [rest.userToken]);

    useEffect(() => {
        if (!rest.userToken) {
            setLoading(true);
            validateFirebaseUser()
                .then(user => user.getIdToken())
                .then(userResult => rest.validateUserToken(userResult))
                .catch(() => {
                    rest.logout();
                    setLoading(false);
                    setShouldRedirect(true);
                });
        }
    }, []);

    if (loading) {
        return (
            <div className="loading-wrapper">
                <LoadingIndicator />
            </div>
        );
    }

    return (
        <Route {...rest} render={(props) => {
            return shouldRedirect ? <Redirect to="/login" /> : <Component {...props} />
        }} />
    );
};

const mapStateToProps = ({ userReducer }) => ({
    userToken: userReducer.userToken
});

const mapDispatchToProps = dispatch => ({
    validateUserToken: idToken => dispatch(validateUserToken(idToken)),
    logout: () => logout()
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)
);
