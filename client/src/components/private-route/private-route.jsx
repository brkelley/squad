import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';

export default function PrivateRoute ({ component: Component, ...rest }) {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [loading, setLoading] = useState(true);

    let { userToken, validateUserToken } = rest;

    useEffect(() => {
        setShouldRedirect(rest.userToken && rest.userToken === 'INVALID');
    }, [rest.userToken]);

    useEffect(() => {
        setLoading(true);
        validateUserToken();
        setLoading(false);
    }, []);

    return loading
?
    (
        <h1>loading</h1>
    )
        : (
            <Route {...rest} render={(props) => {
                return shouldRedirect ? <Redirect to="/login" /> : <Component {...props} />
            }} />
        ) 
};
