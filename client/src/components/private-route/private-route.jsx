import React from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';

export default function PrivateRoute ({ component: Component, ...rest }) {
    const shouldRedirect = !rest.userToken || rest.userToken === '';
    return <Route {...rest} render={(props) => (
        shouldRedirect ? <Redirect to="/login" /> : <Component {...props} />
    )} />
};
