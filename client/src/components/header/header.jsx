import './header.scss';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const Header = ({ location, user }) => {
    const parseRouteHeaders = pathname => {
        if (pathname === '/') return 'Dashboard';
        if (pathname === '/predictions') return 'Predictions';
        if (/users\/(.*)/.test(pathname)) return 'User Details';
        return '';
    };

    const { pathname } = location;
    return (
        <div className="page-title-wrapper">
            <div className="page-title">
                {parseRouteHeaders(pathname)}
            </div>
        </div>
    );
};

const mapStateToProps = ({ userReducer }) => ({
    user: userReducer.user
});

const mapDispatchToProps = () => ({});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
