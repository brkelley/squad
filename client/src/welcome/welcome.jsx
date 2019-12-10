import './welcome.scss';

import React, { useState } from 'react';
import WelcomeCard from './welcome-card/welcome-card.jsx';

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
            <div className="welcome__app-title">
                SQUAD
            </div>
            <div className="welcome__app-logo">
                <i className="fa fa-microphone" />
            </div>
            <div className="welcome__content">
                <WelcomeCard
                    activeTab={activeTab}
                    redirectUrl={redirect} />
            </div>
        </div>
    );
};
