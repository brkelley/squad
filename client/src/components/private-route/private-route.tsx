import './private-route.scss';
import React, { useState, useEffect } from 'react';
import { Redirect, Route, withRouter, RouteProps } from 'react-router-dom';
import LoadingIndicator from '../loading-indicator/loading-indicator';
import connect from './private-route.connector';
import Cookies from 'js-cookie';
import axios from 'axios';

interface PrivateRouteProps extends RouteProps {
    userToken: string;
    setUserTokenToCookies: Function;
    logout: Function;
    setCurrentUser: Function;
    props: any[];
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({
    userToken,
    setUserTokenToCookies,
    logout,
    setCurrentUser,
    ...props
}: PrivateRouteProps) => {
    const [hasValidatedToken, setHasValidatedToken] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userToken) {
            const cookieToken = Cookies.get('squadtoken');

            if (!cookieToken) {
                logout();
                setShouldRedirect(true);
            } else {
                reUpJwtToken(cookieToken);
            }
        } else {
            reUpJwtToken(userToken);
        }
    }, [userToken]);

    const reUpJwtToken = (token) => {
        if (hasValidatedToken) {
            setUserTokenToCookies(token);
            return;
        }
        // set this immediately so we don't get double calls!
        setHasValidatedToken(true);

        axios.get('/auth/validateToken')
            .then((response) => {
                const { token, user } = response.data;
                setUserTokenToCookies(token);
                setCurrentUser(user);
                setIsLoading(false);
            })
            .catch(() => {
                // right now, if it fails it fails
                // no need to check for status codes or messages
                setShouldRedirect(true);
                logout();
            });
    };

    const renderComponent = () => <Redirect to="/login" />;

    if (shouldRedirect) {
        return <Route {...props} component={renderComponent} render={undefined} />;
    }
    if (isLoading) {
        return (
            <div className="private-route-loading">
                <LoadingIndicator />
            </div>
        )
    }

    return (
        <Route {...props} />
    );
};

export default withRouter(
    connect(PrivateRoute)
);
