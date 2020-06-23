import './team-selector.scss';
import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUsers } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../components/button/button';
import _ from 'lodash';
import LEAGUES_METADATA from '../../../constants/leagues.json';
import { TeamMetadata } from '../../../types/pro-play-metadata';

const TeamSelector = ({ userTeam, teamMetadata, closeTeamSelector, updateUserTeam }) => {
    const [transition, setTransition] = useState(false);
    const [selectedFavoriteTeam, setSelectedFavoriteTeam] = useState<TeamMetadata>(userTeam);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const teamsByRegions = _
        .chain(teamMetadata)
        .groupBy((team) => team.homeLeague.name)
        .toPairs()
        .value();

    useEffect(() => {
        setTimeout(() => setTransition(true), 25);
    }, []);

    const beginCloseTeamSelector = async (favoriteTeam) => {
        setTransition(false);
        if (unsavedChanges) {
            await updateUserTeam(favoriteTeam);
            setUnsavedChanges(false);
        }
        setTimeout(closeTeamSelector, 500);
    };

    const renderFavoriteTeam = () => {
        let teamImage;
        let teamName;
        let saveButton;

        if (!selectedFavoriteTeam) {
            teamImage = (
                <FontAwesomeIcon
                    className="current-favorite-team-image"
                    icon={faUsers} />
            );
            teamName = (
                <div className="current-favorite-team-name">
                    No team selected
                </div>
            )
        } else {
            teamImage = (
                <img
                    className="current-favorite-team-image"
                    src={selectedFavoriteTeam.image} />
            );
            teamName = (
                <div className="current-favorite-team-name">
                    {selectedFavoriteTeam.name}
                </div>
            );
        }

        if (_.get(selectedFavoriteTeam, 'id') !== _.get(userTeam, 'id')) {
            saveButton = (
                <div className="save-team-wrapper">
                    <Button
                        buttonLabel="Save Team"
                        click={() => beginCloseTeamSelector(selectedFavoriteTeam)} />
                </div>
            );
        }

        return (
            <div className="current-favorite-team-wrapper">
                {teamImage}
                {teamName}
                {saveButton}
            </div>
        );
    };

    const renderRegionTeam = (team) => {
        const selectedTeamClass = team.id === _.get(selectedFavoriteTeam, 'id') ? 'selected-team' : '';
        const onTeamSelected = () => {
            setUnsavedChanges(true);
            setSelectedFavoriteTeam(team)
        }

        return (
            <div
                className="team-wrapper"
                key={team.name}
                onClick={onTeamSelected}>
                <img
                    className={`team-icon ${selectedTeamClass}`}
                    src={team.image} />
                <div className={`team-label ${selectedTeamClass}`}>
                    {team.name}
                </div>
            </div>
        );
    };

    const renderRegion = ([regionTitle, teams]) => {
        const regionMetadata = LEAGUES_METADATA.find((league) => league.name === regionTitle);
        const regionImage = _.get(regionMetadata, 'image');

        return (
            <div
                className="region-wrapper"
                key={regionTitle}>
                <div className="region-header">
                    <img
                        src={regionImage}
                        className="region-image" />
                    <div className="region-title">
                        {regionTitle}
                    </div>
                </div>
                <div className="region-team-container">
                    {...teams.map((team => renderRegionTeam(team)))}
                </div>
            </div>
        );
    };

    return (
        <div className={`team-selector-container ${transition ? 'team-selector-visible' : ''}`}>
            <div className="team-selector">
                <div className="team-selector-header">
                    Select a Team
                    <FontAwesomeIcon
                        className="team-selector-close-icon"
                        icon={faTimes}
                        onClick={beginCloseTeamSelector} />
                </div>
                <div className="team-selector-body">
                    {renderFavoriteTeam()}
                    <div className="available-teams-wrapper">
                        {teamsByRegions.map((region) => renderRegion(region))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TeamSelector;
