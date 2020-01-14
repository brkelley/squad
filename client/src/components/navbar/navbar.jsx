import './navbar.scss';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

export default function Navbar (props) {
    const [activeNav, setActiveNav] = useState(props.history.location.pathname.split('/')[1]);

    props.history.listen(location => {
        setActiveNav(location.pathname.split('/')[1]);
    })

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
        </div>
    );
};
