import './login.scss';

import React, { useState } from 'react';

export default function Login (props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onLoginClick = () => {
        props.login(username, password)
            .then(() => {
                props.onRedirect('/');
            })
    }

    const renderLogin = () => {
        return (
            <div className="login-action-wrapper">
                <div className="login-textbox-wrapper">
                    <input
                        type="text"
                        className={`login-input ${props.error && 'input-error'}`}
                        placeholder="Username"
                        onChange={e => setUsername(e.target.value)} />
                    <i className={`fa fa-user input-icon ${props.error && 'icon-error'}`}></i>
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="password"
                        className={`login-input ${props.error && 'input-error'}`}
                        placeholder="Password"
                        onChange={e => setPassword(e.target.value)} />
                    <i className={`fa fa-lock input-icon ${props.error && 'icon-error'}`}></i>
                </div>
                <button
                    className="login-button"
                    disabled={!username || !password}
                    onClick={onLoginClick}>
                    LOG IN
                </button>
            </div>
        );
    }

    return renderLogin();
}
