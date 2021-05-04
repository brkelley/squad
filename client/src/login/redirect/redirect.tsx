import './redirect.scss';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import connect from './redirect.connector';
import LoadingIndicator from '../../components/loading-indicator/loading-indicator';
import axios from 'axios';

interface RedirectProps {
    setDiscordInfo: Function;
    setUser: Function;
    setUserTokenToCookies: Function;
}
const DiscordRedirect = ({
    setDiscordInfo,
    setUser,
    setUserTokenToCookies
}: RedirectProps) => {
    const [redirectLink, setRedirectLink] = useState<string|null>(null);
    const queries = new URLSearchParams(window.location.search);
    const code = queries.get('code');

    useEffect(() => {
        if (!code) {
            setRedirectLink('/login');
            return;
        }
        let hostname = 'http://' + location.hostname;
        if (hostname === 'http://localhost') {
            hostname = 'http://localhost:5555';
        }

        axios.get(`/auth/discord?code=${code}&redirectUri=${hostname}/auth/redirect`)
            .then((response) => {
                // for some reason, axios doesn't like catching the error, and instead
                // calls this shit with response of undefined
                if (!response || response.status === 401) {
                    setRedirectLink('/login?error=invalid_code');
                    return
                }
                const userData = response.data;
                const { user, jwtToken, discordInfo } = userData;

                if (user.discordId === '' || user.discordName === '') {
                    setRedirectLink('/login?error=backend_error');
                    return
                }

                setDiscordInfo(discordInfo);

                if (!user.id) {
                    setUser(user);
                    setRedirectLink('/register');
                } else {
                    setUserTokenToCookies(jwtToken);
                    setRedirectLink('/');
                }
            })
            .catch((error) => {
                const { response } = error;
                if (response.data && response.data.message) {
                    setRedirectLink('/login?error=invalid_code');
                }
            });
    }, []);

    return (
        <div className="redirect-wrapper">
            <LoadingIndicator />

            {
                redirectLink && (
                    <Redirect to={redirectLink} />
                )
            }
        </div>
    );
}

export default connect(DiscordRedirect);
