import React from 'react';
import { withRouter } from 'react-router-dom';
import './header.scss';

const ROUTE_HEADERS = {
    '/predictions': 'Predictions',
    '/': 'Dashboard BUTTS'
};

const Header = props => {
    const { pathname } = props.location;
    return (
        <div className="page-title-wrapper">
            <div className="page-title">
                {ROUTE_HEADERS[pathname]}
            </div>
        </div>
    );
};

export default withRouter(Header);
