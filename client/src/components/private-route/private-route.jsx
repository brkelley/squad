import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { validateUserToken } from '../../store/user/user.actions.js';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setShouldRedirect(rest.userToken && rest.userToken === 'INVALID');
    }, [rest.userToken]);

    useEffect(() => {
        setLoading(true);
        validateUserToken();
        setLoading(false);
    }, []);

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
    validateUserToken: dispatch(validateUserToken())
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
