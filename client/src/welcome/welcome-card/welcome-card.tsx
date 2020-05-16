import './welcome-card.scss';
import * as React from 'react';

import Login from '../login/login.tsx';
import Register from '../register/register.tsx';
import ResetPasswordContainer from '../reset-password/reset-password.container.jsx';

export default function WelcomeCard (props) {
    const [activeTab, setActiveTab] = React.useState('login');

    React.useEffect(() => {
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
                return <Login onRedirect={onRedirect} />;
            case 'register':
                return <Register onRedirect={onRedirect} />;
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