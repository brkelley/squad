import './welcome.scss';

import React from 'react';
import WelcomeCard from './welcome-card/welcome-card.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

export default function Welcome (props) {
    let activeTab = props.location.pathname.split('/')[1];

    props.history.listen(location => {
        activeTab = location.pathname.split('/')[1];
    });

    const redirect = redirectUrl => {
        props.history.push(redirectUrl);
    };

    return (
        <div className="welcome-wrapper">
            <div className="welcome__content-card">
                <div className="welcome__app-title">
                    SQUAD
                </div>
                <div className="welcome__content">
                    <WelcomeCard
                        activeTab={activeTab}
                        redirectUrl={redirect} />
                </div>
            </div>
            <div className="welcome__designs">
                <FontAwesomeIcon
                    icon={faMicrophone}
                    className="welcome-icon" />
            </div>
        </div>
    );
};
