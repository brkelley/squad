import './navbar.scss';
import connect from './navbar.connector.js';
import { withRouter } from 'react-router-dom';

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import SettingsPopover from './settings-popover/settings-popover.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCog, faHeadphonesAlt } from '@fortawesome/free-solid-svg-icons';

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
                <FontAwesomeIcon
                    icon={faHeadphonesAlt}
                    className="nav-icon" />
            </Link>
            <div className="navbar-links">
                <Link to="/predictions" className={`navbar-link${ activeNav === 'predictions' ? ' active' : '' }`}>
                    <FontAwesomeIcon icon={faEye} className="nav-icon" />
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
