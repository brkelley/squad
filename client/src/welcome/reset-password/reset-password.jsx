import './reset-password.scss';

import React, { useState } from 'react';
import { validateSummonerName } from '../welcome.util.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircle,
    faCheck,
    faUser,
    faTimes,
    faLock
} from '@fortawesome/free-solid-svg-icons';

export default function ResetPassword (props) {
    // summoner name fields
    const [summonerName, setSummonerName] = useState('');
    const [summonerId, setSummonerId] = useState('');
    const [validatingSummonerName, setValidatingSummonerName] = useState(false);
    const [invalidSummonerName, setInvalidSummonerName] = useState(false);
    const [summonerNameDirty, setSummonerNameDirty] = useState(false);

    // password fields
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [mismatchedPasswords, setMismatchedPasswords] = useState(false);
    const [error, setError] = useState(null);

    const onInputChange = (e, inputType) => {
        switch (inputType) {
            case 'summonerName':
                setSummonerName(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'passwordConfirm':
                setPasswordConfirm(e.target.value);
                break;
        }
    };

    const checkSummonerName = async summonerName => {
        if (!summonerName) return;
        setValidatingSummonerName(true);
        setSummonerNameDirty(true);
        setInvalidSummonerName(false);
        let user;

        try {
            user = await validateSummonerName(summonerName);
            // only allow password reset if hash and salt are null
            if (user.data.hash || user.data.salt) {
                setInvalidSummonerName(true);
                setValidatingSummonerName(false);
                setError('cannot reset password, please contact support');
            } else {
                setError(null);
            }
        } catch (err) {
            setInvalidSummonerName(true);
            setValidatingSummonerName(false);
            setError('invalid summoner name!');
            return;
        }

        setSummonerId(user.data.id);
        setValidatingSummonerName(false);
    };

    const onPasswordConfirm = () => {
        const bothBoxesFull = password !== '' && passwordConfirm !== '';
        if (bothBoxesFull && password !== passwordConfirm) {
            setMismatchedPasswords(true);
            setError('passwords must match!');
        } else {
            setMismatchedPasswords(false);
            setError(null);
        }
    }

    const resetPassword = async () => {
        setPassword('');
        setPasswordConfirm('');
        try {
            await props.resetPassword(summonerId, password);
            props.onRedirect('/');
        } catch (error) {
            setError('cannot reset passsword');
        }
    };

    const renderSummonerNameIcon = () => {
        if (!summonerNameDirty) {
            return <FontAwesomeIcon icon={faUser} className="input-icon" />;
        } else if (validatingSummonerName) {
            return (
                <div className="input-icon load-icon">
                    <FontAwesomeIcon
                        icon={faCircle}
                        className="load-dot" />
                    <FontAwesomeIcon
                        icon={faCircle}
                        className="load-dot" />
                    <FontAwesomeIcon
                        icon={faCircle}
                        className="load-dot" />
                </div>
            );
        } else if (invalidSummonerName) {
            return <FontAwesomeIcon icon={faTimes} className={`input-icon error-icon icon-error`} />;
        } else {
            return <FontAwesomeIcon icon={faCheck} className="input-icon valid-icon" />;
        }
    }

    const renderError = () => {
        if (error) {
            return (
                <div className="login-error-wrapper">
                    {error}
                </div>
            )
        }
    };

    const renderResetPassword = () => {
        return (
            <div className="login-action-wrapper">
                <div className="login-textbox-wrapper">
                    <input
                        type="text"
                        value={summonerName}
                        className={`login-input ${invalidSummonerName && 'input-error'}`}
                        placeholder="summoner name"
                        onBlur={e => checkSummonerName(e.target.value)}
                        onChange={e => setSummonerName(e.target.value)} />
                    {renderSummonerNameIcon()}
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="password"
                        value={password}
                        className={`login-input ${mismatchedPasswords && 'input-error'}`}
                        placeholder="password"
                        onChange={e => setPassword(e.target.value)} />
                        <FontAwesomeIcon
                            icon={faLock}
                            className={`input-icon ${mismatchedPasswords && 'error-icon icon-error'}`} />
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="password"
                        value={passwordConfirm}
                        className={`login-input ${mismatchedPasswords && 'input-error'}`}
                        placeholder="verify password"
                        onChange={e => onInputChange(e, 'passwordConfirm')}
                        onBlur={onPasswordConfirm} />
                        <FontAwesomeIcon
                            icon={faLock}
                            className={`input-icon ${mismatchedPasswords && 'error-icon icon-error'}`} />
                </div>
                <button
                    className="login-button"
                    disabled={!summonerName || !password || !passwordConfirm || mismatchedPasswords}
                    onClick={resetPassword}>
                    RESET PASSWORD
                </button>
                {renderError()}
            </div>
        );
    };
    
    return renderResetPassword();
}
