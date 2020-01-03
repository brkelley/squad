import './welcome-card.scss';

import React, { useState, useEffect } from 'react';
import LoginContainer from '../login/login.container.jsx';
import RegisterContainer from '../register/register.container.jsx';
import ResetPasswordContainer from '../reset-password/reset-password.container.jsx';

export default function WelcomeCard (props) {
    const [activeTab, setActiveTab] = useState('login');

    useEffect(() => {
        setActiveTab(props.activeTab);
    });

    const constructNavigationItemClass = (tabName) => {
        let isActiveTab = activeTab === tabName;
        if (tabName === 'login' && activeTab === 'reset-password') isActiveTab = true;
        return `welcome-card__navigation-item ${isActiveTab && 'active-nav'}`;
    };

    const onRedirect = url => {
        props.redirectUrl(url);
    }

    const renderNavigationContent = () => {
        return (
            <div className="welcome-card__navigation-wrapper">
                <div
                    className={constructNavigationItemClass('login')}
                    onClick={() => onRedirect('/login')}>
                    login
                </div>
                <div
                    className={constructNavigationItemClass('register')}
                    onClick={() => onRedirect('/register')}>
                    register
                </div>
                <div
                    className={constructNavigationItemClass('spectate')}
                    onClick={() => onRedirect('/spectate')}>
                    spectate
                </div>
            </div>
        );
    };

    const renderWelcomeCardContent = () => {
        switch (activeTab) {
            case 'login':
                return <LoginContainer onRedirect={onRedirect} />;
            case 'register':
                return <RegisterContainer onRedirect={onRedirect} />;
            case 'reset-password':
                return <ResetPasswordContainer onRedirect={onRedirect} />;
        }
    };

    return (
        <div className="welcome-card-wrapper">
            {renderNavigationContent()}
            <hr className="welcome-card__nav-separator" />
            <div className="welcome-card__content">
                {renderWelcomeCardContent()}
            </div>
        </div>
    );
};