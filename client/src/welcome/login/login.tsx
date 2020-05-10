import './login.scss';
import * as React from 'react';
import LoginConnect from './login.container.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps<{}> {
    error: string,
    login: Function,
    onRedirect: Function
};

const Login = ({ error, login, onRedirect }: Props) => {
    const [summonerName, setSummonerName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginError, setLoginError] = React.useState('');

    const onLoginClick = () => {
        login(summonerName, password)
            .then(() => {
                onRedirect('/');
            })
            .catch(() => {
                setLoginError('incorrect username or password!');
                setPassword('');
            });
    }
    
    const renderForgotPassword = () => {
        return (
            <div className="forgot-password-prompt" onClick={() => onRedirect('/reset-password')}>
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
                        className={`login-input ${error && 'input-error'}`}
                        placeholder="summoner name"
                        onChange={e => setSummonerName(e.target.value)} />
                    <FontAwesomeIcon
                        icon={faUser}
                        className={`input-icon ${error && 'icon-error'}`} />
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="password"
                        value={password}
                        className={`login-input ${error && 'input-error'}`}
                        placeholder="password"
                        onChange={e => setPassword(e.target.value)} />
                        <FontAwesomeIcon
                            icon={faLock}
                            className={`input-icon ${error && 'icon-error'}`} />
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
};

export default LoginConnect(Login);
