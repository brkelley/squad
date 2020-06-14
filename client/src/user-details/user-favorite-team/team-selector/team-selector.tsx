import './team-selector.scss';
import React, { useState } from 'react';

const TeamSelector = ({ teamMetadata, closeTeamSelector }) => {
    const [transition, setTransition] = useState(false);

    setTimeout(() => {
        setTransition(true);
    }, 1000)

    return (
        <div className={`team-selector ${transition ? 'team-selector-visible' : ''}`}>
            <div>Hello World!</div>
        </div>
    )
};

export default TeamSelector;
