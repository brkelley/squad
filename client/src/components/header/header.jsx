import React from 'react';
import './header.scss';
import { connect } from 'react-redux';

const Header = props => {
    return (
        <div className="page-title-wrapper">
            <div className="page-title">
                Predictions
            </div>
        </div>
    );
};

export default Header;
