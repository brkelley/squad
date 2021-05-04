import './login.scss';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import SquadTitle from '../assets/squad-title.png';

let hostname = 'http://' + location.hostname;
if (hostname === 'http://localhost') {
    hostname = 'http://localhost:5555';
}
const encodedHostname = encodeURIComponent(hostname);
const DISCORD_AUTHORIZE_URL = `https://discord.com/api/oauth2/authorize?client_id=805510957404782623&redirect_uri=${encodedHostname}%2Fauth%2Fredirect&response_type=code&scope=identify`;

const Login = () => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const queries = new URLSearchParams(window.location.search);
    const error = queries.get('error');

    useEffect(() => {
        switch (error) {
            case 'invalid_code':
                setErrorMessage('Invalid Discord access token!');
                break;
            case 'backend_error':
                setErrorMessage('Error - please try again');
                break;
        }
    }, []);

    return (
        <div className="login-wrapper">
            <div className="login-content">
                <div className="app-title">
                    <img
                        className="app-title-image"
                        src={SquadTitle} />
                </div>
                {
                    errorMessage && (
                        <div className="login-error-wrapper">
                            <FontAwesomeIcon
                                icon={faTimesCircle}
                                className="error-icon" />
                            <div className="login-main-error">
                                {errorMessage}
                            </div>
                        </div>
                    )
                }
                <a
                    className="discord-authentication-link"
                    href={DISCORD_AUTHORIZE_URL}>
                    <FontAwesomeIcon
                        icon={faDiscord}
                        className="discord-icon" />
                    <span className="discord-link-text">
                        Login with Discord
                    </span>
                </a>
            </div>
        </div>
    );
};

export default Login;
