import './navbar.scss';
import connect from './navbar.connector.js';
import { withRouter } from 'react-router-dom';

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import SquadLogo from '../../assets/squad-logo.png';

import SettingsPopover from './settings-popover/settings-popover.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle as faCheckCircleActive,
    faCog,
} from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';

const Navbar = ({ history, user, logout }) => {
    const node = useRef<HTMLDivElement>(null);
    const [activeNav, setActiveNav] = useState(history.location.pathname.split('/')[1]);
    const [settingsPopoutActive, setSettingsPopoutActive] = useState(false);

    useEffect(() => {
        if (settingsPopoutActive) {
            const container = document.createElement('div');
            container.setAttribute('id', 'settings-popover');
            document.body.appendChild(container);
            ReactDOM.render(settingsPopover, container);
        } else {
            const element = document.getElementById('settings-popover');
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    }, [settingsPopoutActive]);

    history.listen(location => {
        setActiveNav(location.pathname.split('/')[1]);
    });

    const startLogout = () => {
        setSettingsPopoutActive(false);
        const element = document.getElementById('settings-popover');
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
        logout();
        history.push('/login');
    };

    const settingsPopover = (
        <SettingsPopover
            user={user}
            settingsPopoutActive={settingsPopoutActive}
            logout={startLogout}
            collapseSettingsPopover={() => setSettingsPopoutActive(false)}
            history={history}
            toggleButton={node} />
    );

    return (
        <div className="navbar-wrapper">
            <Link
                to="/"
                className="navbar-app-title">
                <img
                    className="squad-logo"
                    src={SquadLogo} />
            </Link>
            <div className="navbar-links">
                <Link to="/predictions" className={`navbar-link ${ activeNav === 'predictions' ? 'active-nav' : '' }`}>
                    <FontAwesomeIcon
                        icon={activeNav === 'predictions' ? faCheckCircleActive : faCheckCircle}
                        className="nav-icon" />
                    Predictions
                </Link>
            </div>
            <div
                className="navbar-user"
                ref={node}
                onClick={() => setSettingsPopoutActive(!settingsPopoutActive)}>
                <FontAwesomeIcon icon={faCog} className="nav-icon" />
                Settings
            </div>
        </div>
    );
};

export default withRouter(connect(Navbar));
