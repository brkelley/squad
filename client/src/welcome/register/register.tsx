import './register.scss';
import * as React from 'react';
import connectRegister from './register.container.js';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCode,
    faCircle,
    faCheck,
    faUser,
    faTimes,
    faLock,
    faSignature,
    faAt
} from '@fortawesome/free-solid-svg-icons';

const Register = (props) => {
    // input box for registration code
    const [registrationCode, setRegistrationCode] = useState('');
    const [invalidRegistrationCode, setInvalidRegistrationCode] = useState(false);

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

    // first & last name and email fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    // errors
    const [error, setError] = useState('');

    const onInputChange = (e, inputType) => {
        switch (inputType) {
            case 'registrationCode':
                setRegistrationCode(e.target.value);
                break;
            case 'summonerName':
                setSummonerName(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'passwordConfirm':
                setPasswordConfirm(e.target.value);
                break;
            case 'firstName':
                setFirstName(e.target.value);
                break;
            case 'lastName':
                setLastName(e.target.value);
                break;
            case 'email':
                setEmail(e.target.value);
                break;
        }
    };

    const validateRegistrationCode = () => {
        setInvalidRegistrationCode(!!registrationCode && registrationCode !== 'GoldenShowerPowerHour');
    }

    const validateSummonerName = async summonerName => {
        if (!summonerName) return;
        setValidatingSummonerName(true);
        setSummonerNameDirty(true);
        setInvalidSummonerName(false);
        let verifiedSummonerName;

        try {
            verifiedSummonerName = await props.verifySummonerName(summonerName);
            setError('');
        } catch (err) {
            setInvalidSummonerName(true);
            setValidatingSummonerName(false);
            setError(`${err.message}!`);
            return;
        }

        setSummonerId(verifiedSummonerName.data.id);
        setValidatingSummonerName(false);
    };

    const onPasswordConfirm = () => {
        const bothBoxesFull = password !== '' && passwordConfirm !== '';
        if (bothBoxesFull && password !== passwordConfirm) {
            setMismatchedPasswords(true);
            setError('passwords must match!');
        } else {
            setMismatchedPasswords(false);
            setError('');
        }
    }

    const registerNewUser = async () => {
        setPasswordConfirm('');
        setPassword('');
        try {
            await props.registerNewUser({ summonerName, summonerId, password, email, firstName, lastName, registrationCode, role: 3 });
            props.onRedirect('/');
        } catch (error) {
            setError('cannot create new user, please try again later');
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
    }

    const renderRegister = () => {
        const buttonDisabled = invalidRegistrationCode || mismatchedPasswords || invalidSummonerName || !summonerName || !password || !passwordConfirm;
        return (
            <div className="login-action-wrapper">
                <div className="login-textbox-wrapper">
                    <input
                        type="text"
                        className={`login-input ${invalidRegistrationCode && 'input-error'}`}
                        placeholder="registration code"
                        onBlur={e => validateRegistrationCode()}
                        onChange={e => onInputChange(e, 'registrationCode')} />
                    <FontAwesomeIcon
                        icon={faCode}
                        className={`input-icon ${invalidRegistrationCode && 'error-icon icon-error'}`} />
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="text"
                        className={`login-input ${invalidSummonerName && 'input-error'}`}
                        placeholder="summoner name"
                        onBlur={e => validateSummonerName(e.target.value)}
                        onChange={e => onInputChange(e, 'summonerName')} />
                    {renderSummonerNameIcon()}
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="password"
                        value={password}
                        className={`login-input ${mismatchedPasswords && 'input-error'}`}
                        placeholder="password"
                        onChange={e => onInputChange(e, 'password')}
                        onBlur={onPasswordConfirm} />
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
                <div className="login-textbox-wrapper">
                    <input
                        type="input"
                        className={`login-input`}
                        placeholder="first name (optional)"
                        onChange={e => onInputChange(e, 'firstName')} />
                        <FontAwesomeIcon
                            icon={faSignature}
                            className="input-icon" />
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="input"
                        className={`login-input`}
                        placeholder="last name (optional)"
                        onChange={e => onInputChange(e, 'lastName')} />
                        <FontAwesomeIcon
                            icon={faSignature}
                            className="input-icon" />
                </div>
                <div className="login-textbox-wrapper">
                    <input
                        type="input"
                        className={`login-input`}
                        placeholder="email (optional)"
                        onChange={e => onInputChange(e, 'email')} />
                        <FontAwesomeIcon
                            icon={faAt}
                            className="input-icon" />
                </div>
                <button
                    className="login-button"
                    onClick={registerNewUser}
                    disabled={buttonDisabled}>
                    REGISTER
                </button>
                {renderError()}
            </div>
        );
    };

    return renderRegister();
}

export default connectRegister(Register);
