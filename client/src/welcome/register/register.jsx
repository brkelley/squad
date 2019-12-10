import './register.scss';

import React, { useState } from 'react';

export default function Register (props) {
    const [validating, setValidating] = useState(false);
    const [invalidSummonerId, setInvalidSummonerId] = useState(false);
    const [usernameDirty, setUsernameDirty] = useState(false);
    const [username, setUsername] = useState('');
    const [summonerId, setSummonerId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [mismatchedPasswords, setMismatchedPasswords] = useState(false);

    const onInputChange = (e, inputType) => {
        if (inputType === 'username') {
            setUsername(e.target.value);
        } else if (inputType === 'password') {
            setPassword(e.target.value);
        } else if (inputType === 'passwordConfirm') {
            setPasswordConfirm(e.target.value);
        }
    };

    const validateSummonerName = async (summonerName) => {
        if (!summonerName) return;
        setValidating(true);
        setUsernameDirty(true);
        setInvalidSummonerId(false);
        let verifiedUsername;

        try {
            verifiedUsername = await props.verifySummonerName(summonerName);
        } catch (err) {
            console.log(err);
            setInvalidSummonerId(true);
            setValidating(false);
            return;
        }

        setSummonerId(verifiedUsername.data.id);
        setValidating(false);
    };

    const onPasswordConfirm = () => {
        if (password !== passwordConfirm) {
            setMismatchedPasswords(true);
            props.onUserError('Passwords must match');
        }
    }

    const registerNewUser = () => {
        props.registerNewUser({ username, summonerId, password });
    };

    const renderUsernameIcon = () => {
        if (!usernameDirty) {
            return <i className="fa fa-user input-icon"></i>;
        } else if (validating) {
            return (
                <div className="input-icon load-icon">
                    <i className="fa fa-circle load-dot"></i>
                    <i className="fa fa-circle load-dot"></i>
                    <i className="fa fa-circle load-dot"></i>
                </div>
            );
        } else if (invalidSummonerId) {
            return <i className={`fa fa-times input-icon error-icon ${props.error && 'icon-error'}`}></i>;
        } else {
            return <i className="fa fa-check input-icon valid-icon"></i>;
        }
    }

    const renderRegister = () => {
        const buttonDisabled = mismatchedPasswords || invalidSummonerId || !username || !password || !passwordConfirm;
        return (
            <div className="login-action-wrapper">
                <div className="login-textbox-wrapper">
                    <input
                        type="text"
                        className={`login-input ${invalidSummonerId && 'input-error'}`}
                        placeholder="League username"
                        onBlur={e => validateSummonerName(e.target.value)}
                        onChange={e => onInputChange(e, 'username')} />
                    {renderUsernameIcon()}
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="password"
                        className={`login-input ${mismatchedPasswords && 'input-error'}`}
                        placeholder="Password"
                        onChange={e => onInputChange(e, 'password')} />
                        <i className={`fa fa-${mismatchedPasswords ? 'times error-icon icon-error' : 'lock'} input-icon`}></i>
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="password"
                        className={`login-input ${mismatchedPasswords && 'input-error'}`}
                        placeholder="Verify password"
                        onChange={e => onInputChange(e, 'passwordConfirm')}
                        onBlur={onPasswordConfirm} />
                    <i className={`fa fa-${mismatchedPasswords ? 'times error-icon icon-error' : 'lock'} input-icon`}></i>
                </div>
                <button
                    className="login-button"
                    onClick={registerNewUser}
                    disabled={buttonDisabled}>
                    REGISTER
                </button>
            </div>
        );
    };

    return renderRegister();
}
