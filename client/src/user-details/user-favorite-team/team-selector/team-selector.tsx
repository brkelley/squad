import './team-selector.scss';
import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import LEAGUES_METADATA from '../../../constants/leagues.json';
import { TeamMetadata } from '../../../types/pro-play-metadata';

const TEST_FAVE_TEAM = {
    "id": "98767991866488695",
    "slug": "fnatic",
    "name": "Fnatic",
    "code": "FNC",
    "image": "https://lolstatic-a.akamaihd.net/esports-assets/production/team/fnatic-9gbeptb1.png",
    "alternativeImage": "https://lolstatic-a.akamaihd.net/esports-assets/production/team/fnatic-8w0cvhu1.png",
    "backgroundImage": "https://lolstatic-a.akamaihd.net/esports-assets/production/team/fnatic-719v4q48.png",
    "homeLeague": {
        "name": "LEC",
        "region": "EUROPE"
    },
    players: []
};

const TeamSelector = ({ teamMetadata, closeTeamSelector }) => {
    const [transition, setTransition] = useState(false);
    const [selectedFavoriteTeam, setSelectedFavoriteTeam] = useState<TeamMetadata>(TEST_FAVE_TEAM);

    const teamsByRegions = _
        .chain(teamMetadata)
        .groupBy((team) => team.homeLeague.name)
        .toPairs()
        .value();

    useEffect(() => {
        setTimeout(() => setTransition(true), 25);
    }, []);

    const beginCloseTeamSelector = () => {
        setTransition(false);
        setTimeout(closeTeamSelector, 500);
    };

    const renderRegionTeam = (team) => {
        return (
            <div
                className="team-wrapper"
                key={team.name}>
                <img
                    className="team-icon"
                    src={team.image} />
                <div className="team-label">
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
                    <div className="current-favorite-team-wrapper">
                        FNATIC
                    </div>
                    <div className="available-teams-wrapper">
                        {teamsByRegions.map((region) => renderRegion(region))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TeamSelector;
