import './welcome-card.scss';

import React, { useState, useEffect } from 'react';
import LoginContainer from '../login/login.container.jsx';
import RegisterContainer from '../register/register.container.jsx';

export default function WelcomeCard (props) {
    const [activeTab, setActiveTab] = useState('login');

    useEffect(() => {
        setActiveTab(props.activeTab);
    });

    const heightMap = {
        login: { height: '252px' },
        register: { height: '323px' }
    };

    const constructNavigationItemClass = (tabName) => {
        return `welcome-card__navigation-item ${activeTab === tabName && 'active-nav'}`
    };

    const onRedirect = url => {
        props.redirectUrl(url);
    }

    const renderWelcomeCardContent = () => {
        switch (activeTab) {
            case 'login':
                return <LoginContainer onRedirect={onRedirect} />;
            case 'register':
                return <RegisterContainer onRedirect={onRedirect} />;
        }
    };

    return (
        <div
            className="welcome-card-wrapper"
            style={heightMap[activeTab]}>
            <div className="welcome-card__navigation-wrapper">
                <div className="welcome-card__navigation">
                    <div
                        className={constructNavigationItemClass('login')}
                        onClick={() => onRedirect('/login')}>
                        LOGIN
                    </div>
                    <div
                        className={constructNavigationItemClass('register')}
                        onClick={() => onRedirect('/register')}>
                        REGISTER
                    </div>
                    <div
                        className={constructNavigationItemClass('spectate')}
                        onClick={() => onRedirect('/spectate')}>
                        SPECTATE
                    </div>
                </div>
            </div>
            <div className="welcome-card__content">
                {renderWelcomeCardContent()}
            </div>
        </div>
    );
};