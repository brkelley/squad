import './team-selector.scss';
import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import LEAGUES_METADATA from '../../../constants/leagues.json';

const TeamSelector = ({ teamMetadata, closeTeamSelector }) => {
    const [transition, setTransition] = useState(false);

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

    const renderRegion = ([regionTitle, teams]) => {
        const regionMetadata = LEAGUES_METADATA.find((league) => league.name === regionTitle);
        const regionImage = _.get(regionMetadata, 'image');

        return (
            <div
                className="region-wrapper"
                key={regionTitle}>
                <div className="region-header">
                    <div className="region-title">
                        {regionTitle}
                    </div>
                    <img
                        src={regionImage}
                        className="region-image" />
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
                {teamsByRegions.map((region) => renderRegion(region))}
            </div>
        </div>
    )
};

export default TeamSelector;
