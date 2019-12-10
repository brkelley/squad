import './top-navbar.scss';

import React from 'react';
import { Link } from 'react-router-dom';

export default function TopNavbar () {
    return (
        <div className="top-navbar-wrapper">
            <Link
                to="/"
                className="navbar-app-title">
                SQUAD
            </Link>
            <div className="navbar-links">
                <Link
                    to="/predictions"
                    className="navbar-link">
                    Predictions
                </Link>
            </div>
        </div>
    );
};
