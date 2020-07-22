import './register.scss';
import React, { useState } from 'react';
import connect from './register.connector';
import { Redirect } from 'react-router-dom';
import Input from '../components/input/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAt,
    faCheckCircle,
    faSpinner,
    faTimes,
    faUser
} from '@fortawesome/free-solid-svg-icons';
import { DiscordInfo } from '../utils/discord.util';
import { User } from '../types/user';
import SquadButton from '../components/squad-button/squad-button';
import isEmpty from 'lodash/isEmpty';

interface RegisterProps {
    user: User;
    userToken: string;
    discordInfo: DiscordInfo;
    registerNewUser: Function;
    validateSummonerName: Function;
}
const Register = ({
    user,
    userToken,
    discordInfo,
    registerNewUser,
    validateSummonerName
}: RegisterProps) => {
    const [summonerName, setSummonerName] = useState<string>(user.summonerName);
    const [summonerNameState, setSummonerNameState] = useState<string>('ready');
    const [summonerId, setSummonerId] = useState<string>('');
    const [email, setEmail] = useState<string>(user.email);
    const [firstName, setFirstName] = useState<string>(user.firstName);
    const [lastName, setLastName] = useState<string>(user.lastName);

    if (userToken && userToken !== '') {
        // this whole function's goal is to generate a jwt token
        // when the token is generated, we know we're free to redirect
        return <Redirect to="/" />;
    }

    if (!discordInfo || isEmpty(discordInfo)) {
        return <Redirect to="/login" />;
    }

    const onSummonerNameBlur = async () => {
        if (summonerName === '') return;
        try {
            setSummonerNameState('loading');
            const riotSummonerNameResponse = await validateSummonerName(summonerName);
            // again, axios is being annoying
            if (!riotSummonerNameResponse) {
                setSummonerNameState('notFound');
                return;
            }

            setSummonerNameState('valid');
            setSummonerId(riotSummonerNameResponse.data.id);
        } catch ({ message }) {
            if (message === 'summoner name doesn\'t exist') {
                setSummonerNameState('notFound');
            }
        }
    };

    const renderRegisterButton = () => {
        const isDisabled = summonerNameState !== 'valid';
        return (
            <SquadButton
                label="Create Account"
                disabled={isDisabled}
                click={onUserRegistered} />
        );
    }

    const onUserRegistered = () => {
        const { expires_in, access_token, refresh_token } = discordInfo;
        registerNewUser({
            user: {
                ...user,
                summonerName,
                summonerId,
                email,
                firstName,
                lastName
            },
            discordRegistration: {
                expires_in,
                access_token,
                refresh_token
            }
        });
    };

    const renderSummonerNameIcon = () => {
        if (summonerNameState === 'ready') {
            return '';
        }

        let chosenIcon;
        let iconClass;
        switch (summonerNameState) {
            case 'loading':
                chosenIcon = faSpinner;
                break;
            case 'notFound':
                chosenIcon = faTimes;
                iconClass = 'icon-error';
                break;
            case 'valid':
                chosenIcon = faCheckCircle;
                iconClass = 'icon-success';
                break;
        }

        return (
            <FontAwesomeIcon
                className={`summoner-name-status-icon ${iconClass}`}
                icon={chosenIcon} />
        );
    };

    const renderRegister = () => {
        return (
            <div className="register-fields">
                <div className="summoner-name-error">
                    { summonerNameState === 'notFound' ? 'Invalid summoner name' : '' }
                </div>
                <div className="register-field">
                    <Input
                        prefix={
                            (
                                <img
                                    className="input-prefix-icon"
                                    src="https://cdn.iconscout.com/icon/free/png-512/league-of-legends-555171.png" />
                            )
                        }
                        suffix={renderSummonerNameIcon()}
                        placeholder="summoner name"
                        value={summonerName}
                        blur={onSummonerNameBlur}
                        change={setSummonerName} />
                </div>
                <hr className="optional-fields-separator" />
                <div className="separator-text">
                    optional
                </div>
                <div className="register-field">
                    <Input
                        prefix={
                            (
                                <FontAwesomeIcon
                                    className="input-prefix-icon"
                                    icon={faAt} />
                            )
                        }
                        placeholder="email"
                        value={email}
                        change={setEmail} />
                </div>
                <div className="register-field">
                    <Input
                        prefix={
                            (
                                <FontAwesomeIcon
                                    className="input-prefix-icon"
                                    icon={faUser} />
                            )
                        }
                        placeholder="first name"
                        value={firstName}
                        change={setFirstName} />
                </div>
                <div className="register-field">
                    <Input
                        prefix={
                            (
                                <FontAwesomeIcon
                                    className="input-prefix-icon"
                                    icon={faUser} />
                            )
                        }
                        placeholder="last name"
                        value={lastName}
                        change={setLastName} />
                </div>
            </div>
        );
    };

    return (
        <div className="register-wrapper">
            <div className="welcome-message">
                Welcome {user.discordName}
            </div>
            {renderRegister()}
            <div className="create-account-button">
                {renderRegisterButton()}
            </div>
        </div>
    );
}

export default connect(Register);
