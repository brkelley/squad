import React from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import isEmpty from 'lodash/isEmpty';

export default function PrivateRoute ({ component: Component, ...rest }) {
    let validating = false;
    let { user, userToken, validateUserToken } = rest;
    if (!userToken) {
        userToken = Cookies.get('userToken');
    }
    let shouldRedirect = (!userToken || userToken === '');

    if (!shouldRedirect && isEmpty(user)) {
        validating = true;
        validateUserToken(userToken).then(({ valid }) => {
            shouldRedirect = !valid;
            validating = false;
        });
    }

    return validating ? <h1>loading</h1> : <Route {...rest} render={(props) => (
        shouldRedirect ? <Redirect to="/login" /> : <Component {...props} />
    )} />
};
