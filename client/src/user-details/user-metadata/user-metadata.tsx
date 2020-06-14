import './user-metadata.scss';
import React, { useState } from 'react';

import Button from '../../components/button/button';
import Input from '../../components/input/input.jsx';

const UserMetadata = ({ user, updateUser, resyncSummonerName }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [firstNameForm, setFirstNameForm] = useState(user.firstName);
    const [lastNameForm, setLastNameForm] = useState(user.lastName);
    const [emailForm, setEmailForm] = useState(user.email);

    const initializeUserUpdate = async () => {
        setIsSaving(true);
        await updateUser({
            id: user.id,
            firstName: firstNameForm,
            lastName: lastNameForm,
            email: emailForm
        });
        setIsSaving(false);
        setIsEditing(false);
    };

    const cancelUserUpdate = () => {
        setFirstNameForm(user.firstName);
        setLastNameForm(user.lastName);
        setEmailForm(user.email);
        setIsEditing(false);
    }

    const syncSummonerName = async () => {
        setIsSyncing(true);
        try {
            await resyncSummonerName(user.id, user.summonerId);
        } catch (error) {
            console.error(error);
        }
        setIsSyncing(false);
    };

    const renderValueField = (value, setValue) => {
        if (isEditing) {
            return (
                <div className="user-metadata-input">
                    <Input
                        value={value}
                        change={setValue} />
                </div>
            );
        }

        return (
            <div className="user-metadata-value">
                {value}
            </div>
        );
    }
    
    const renderUserActions = () => {
        if (!isEditing) {
            return (
                <div className="user-metadata-actions">
                    <Button
                        buttonLabel="Edit"
                        click={() => setIsEditing(!isEditing)}
                    />
                </div>
            );
        }

        return (
            <div className="user-metadata-actions">
                <Button
                    buttonLabel="Save"
                    loading={isSaving}
                    click={() => initializeUserUpdate()}
                />
                <Button
                    buttonLabel="Cancel"
                    click={() => cancelUserUpdate()} />
            </div>
        );
    };

    return (
        <div className="user-metadata">
            <div className="user-metadata-set summoner-name-set">
                <div className="user-summoner-name-pairing">
                    <div className="user-metadata-label">
                        summoner name
                    </div>
                    <div className="user-metadata-field">
                        {user.summonerName}
                    </div>
                </div>
                <Button
                    buttonLabel="Sync"
                    loading={isSyncing}
                    click={() => syncSummonerName()} />
            </div>
            <div className="user-metadata-set">
                <div className="user-metadata-label">
                    first name
                </div>
                <div className="user-metadata-field">
                    {renderValueField(user.firstName, setFirstNameForm)}
                </div>
            </div>
            <div className="user-metadata-set">
                <div className="user-metadata-label">
                    last name
                </div>
                <div className="user-metadata-field">
                    {renderValueField(user.lastName, setLastNameForm)}
                </div>
            </div>
            <div className="user-metadata-set">
                <div className="user-metadata-label">
                    email
                </div>
                <div className="user-metadata-field">
                    {renderValueField(user.email, setEmailForm)}
                </div>
            </div>
            {renderUserActions()}
        </div>
    )
};

export default UserMetadata;
