import './navbar.scss';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import SettingsPopover from './settings-popover/settings-popover.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCog } from '@fortawesome/free-solid-svg-icons';

const Navbar = props => {
    const [activeNav, setActiveNav] = useState(props.history.location.pathname.split('/')[1]);
    const [settingsPopoutActive, setSettingsPopoutActive] = useState(false);

    props.history.listen(location => {
        setActiveNav(location.pathname.split('/')[1]);
    });

    return (
        <div className="navbar-wrapper">
            <Link
                to="/"
                className="navbar-app-title">
                SQUAD
            </Link>
            <div className="navbar-links">
                <Link to="/predictions" className={`navbar-link${ activeNav === 'predictions' ? ' active' : '' }`}>
                    <FontAwesomeIcon icon={faEye} className="nav-icon" />
                    Predictions
                </Link>
            </div>
            <div className="navbar-user" onClick={() => setSettingsPopoutActive(!settingsPopoutActive)}>
                <FontAwesomeIcon icon={faCog} className="nav-icon" />
                Settings
            </div>
            <SettingsPopover
                settingsPopoutActive={settingsPopoutActive} />
        </div>
    );
};

export default Navbar;
