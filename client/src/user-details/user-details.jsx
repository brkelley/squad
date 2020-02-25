import './user-details.scss';
import React, { useState } from 'react';
import Input from '../components/input/input.jsx';
import Button from '../components/button/button.jsx';

import UserDetailsStore from './user-details.store.js';

const UserDetails = ({ user, beginSummonerResync, beginUserUpdate }) => {
    const { summonerName, firstName, lastName, email } = user;

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [firstNameForm, setFirstNameForm] = useState(firstName);
    const [lastNameForm, setLastNameForm] = useState(lastName);
    const [emailForm, setEmailForm] = useState(email);

    const initializeUserUpdate = async () => {
        setIsSaving(true);
        await beginUserUpdate({
            id: user.id,
            firstName: firstNameForm,
            lastName: lastNameForm,
            email: emailForm
        });
        setIsSaving(false);
        setIsEditing(false);
    };

    const renderValueField = (value, setValue) => {
        if (isEditing) {
            return (
                <Input
                    value={value}
                    change={setValue}
                />
            );
        }

        return (
            <div className="user-value-text">
                {value}
            </div>
        );
    };

    const renderUserActions = () => {
        if (!isEditing) {
            return (
                <div className="user-details-actions">
                    <Button
                        buttonLabel="Edit"
                        click={() => setIsEditing(!isEditing)}
                    />
                </div>
            );
        }

        return (
            <div className="user-details-actions">
                <Button
                    buttonLabel="Save"
                    loading={isSaving}
                    click={() => initializeUserUpdate(user)}
                />
            </div>
        );
    };

    const syncSummonerName = async () => {
        setIsSyncing(true);
        try {
            await beginSummonerResync(user.id, user.summonerId);
        } catch (error) {
            console.error(error);
        }
        setIsSyncing(false);
    };

    return (
        <div className="user-details-wrapper">
            <div className="user-information-wrapper">
                <div className="user-field">
                    <div className="user-label">
                        summoner name:
                    </div>
                    <div className="user-value value-with-button">
                        <div className="user-value-text">
                            {summonerName}
                        </div>
                        <Button buttonLabel="sync" click={syncSummonerName} loading={isSyncing} />
                    </div>
                </div>

                <div className="user-field">
                    <div className="user-label">
                        first name:
                    </div>
                    <div className="user-value">
                        {renderValueField(firstNameForm, setFirstNameForm)}
                    </div>
                </div>

                <div className="user-field">
                    <div className="user-label">
                        last name:
                    </div>
                    <div className="user-value">
                        {renderValueField(lastNameForm, setLastNameForm)}
                    </div>
                </div>

                <div className="user-field">
                    <div className="user-label">
                        email:
                    </div>
                    <div className="user-value">
                        {renderValueField(emailForm, setEmailForm)}
                    </div>
                </div>

                {renderUserActions()}
            </div>
        </div>
    );
};

export default UserDetailsStore(UserDetails);
