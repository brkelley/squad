import './login.scss';
import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps<{}> {};

export default function Login (props) {
    const [summonerName, setSummonerName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginError, setLoginError] = React.useState('');

    const onLoginClick = () => {
        props.login(summonerName, password)
            .then(() => {
                props.onRedirect('/');
            })
            .catch(() => {
                setLoginError('incorrect username or password!');
                setPassword('');
            });
    }
    
    const renderForgotPassword = () => {
        return (
            <div className="forgot-password-prompt" onClick={() => props.onRedirect('/reset-password')}>
                forgot password?
            </div>
        )
    };

    const renderLoginError = () => {
        if (loginError) {
            return (
                <div className="login-error-wrapper">
                    {loginError}
                </div>
            );
        } else {
            return '';
        }
    }

    const renderLogin = () => {
        return (
            <div className="login-action-wrapper">
                <div className="login-textbox-wrapper">
                    <input
                        type="text"
                        value={summonerName}
                        className={`login-input ${props.error && 'input-error'}`}
                        placeholder="summoner name"
                        onChange={e => setSummonerName(e.target.value)} />
                    <FontAwesomeIcon
                        icon={faUser}
                        className={`input-icon ${props.error && 'icon-error'}`} />
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="password"
                        value={password}
                        className={`login-input ${props.error && 'input-error'}`}
                        placeholder="password"
                        onChange={e => setPassword(e.target.value)} />
                        <FontAwesomeIcon
                            icon={faLock}
                            className={`input-icon ${props.error && 'icon-error'}`} />
                </div>
                <button
                    className="login-button"
                    disabled={!summonerName || !password}
                    onClick={onLoginClick}>
                    LOG IN
                </button>
                {renderForgotPassword()}
                {renderLoginError()}
            </div>
        );
    }

    return renderLogin();
}
