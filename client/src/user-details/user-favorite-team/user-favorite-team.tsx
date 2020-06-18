import './user-favorite-team.scss';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import TeamSelector from './team-selector/team-selector';

const UserFavoriteTeam = ({ teamMetadata, userTeam }) => {
    const [teamSelectorActive, setTeamSelectorActive] = useState(false);

    setTimeout(() => {
        setTeamSelectorActive(true);
    }, 750);

    useEffect(() => {
        if (!teamMetadata) return;

        const teamSelector = (
            <TeamSelector
                teamMetadata={teamMetadata}
                closeTeamSelector={() => setTeamSelectorActive(false)} />
        );

        if (teamSelectorActive) {
            const container = document.createElement('div');
            container.setAttribute('id', 'team-selector-popover');
            document.body.appendChild(container);
            ReactDOM.render(teamSelector, container);
        } else {
            const element = document.getElementById('team-selector-popover');
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    }, [teamSelectorActive]);

    const renderTeamInfo = () => {
        const teamImageElement = userTeam
            ? <img className="team-logo" src={userTeam.image} />
            : <FontAwesomeIcon className="team-logo no-team" icon={faUsers} />;

        const teamNameElement = userTeam
            ? userTeam.name
            : '';

        return (
            <div className="favorite-team">
                <div className="team-logo-wrapper">
                    {teamImageElement}
                </div>
                <div className="team-name-wrapper">
                    {teamNameElement}
                </div>
            </div>
        )
    }

    return (
        <div
            className="favorite-team-wrapper"
            onClick={() => setTeamSelectorActive(true)}>
            <div className="team-title">
                favorite team
            </div>
            {renderTeamInfo()}
        </div>
    );
};

export default UserFavoriteTeam;
