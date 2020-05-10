import * as React from 'react';
import './welcome.scss';
import connectWelcome from './welcome.container.js';

import WelcomeCard from './welcome-card/welcome-card.tsx';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps<{}> {};

const Welcome = ({ location, history }: Props) => {
    let activeTab = location.pathname.split('/')[1];

    history.listen((location) => {
        activeTab = location.pathname.split('/')[1];
    });

    const redirect = (redirectUrl) => {
        history.push(redirectUrl);
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
        </div>
    );
};

export default connectWelcome(Welcome);
