import './user-details.scss';
import UserDetailsStore from './user-details.connector';
import React, { useEffect } from 'react';

import UserMetadata from './user-metadata/user-metadata';
import UserFavoriteTeam from './user-favorite-team/user-favorite-team';
import get from 'lodash/get';

const UserDetails = ({
    user,
    teamMetadata,
    resyncSummonerName,
    updateUser,
    loadAllTeams
}) => {
    useEffect(() => {
        loadAllTeams();
    }, []);

    const updateUserTeam = async (favoriteTeam) => {
        await updateUser({
            ...user,
            preferences: {
                favoriteTeam
            }
        });
    };

    const userTeam = get(user.preferences, 'favoriteTeam');

    return (
        <div className="user-details-wrapper">
            <div className="user-details-section user-metadata-wrapper">
                <UserMetadata
                    user={user}
                    updateUser={updateUser}
                    resyncSummonerName={resyncSummonerName} />
            </div>
            <div className="user-details-section team-selector-wrapper">
                <UserFavoriteTeam
                    teamMetadata={teamMetadata}
                    userTeam={userTeam}
                    updateUserTeam={updateUserTeam} />
            </div>
        </div>
    );
};

export default UserDetailsStore(UserDetails);
