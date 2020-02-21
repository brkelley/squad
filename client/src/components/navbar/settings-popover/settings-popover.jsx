import './settings-popover.scss';
import React, { useState } from 'react';
import { connect } from 'react-redux';

import { logout } from '../../../store/user/user.actions.js';

const SettingsPopover = props => {
    const { settingsPopoutActive, storeLogout } = props;

    const startLogout = () => {
        storeLogout();
        console.log(props);
        props.history.push('/login');
    };

    return (
        <div className={`nav-popout ${settingsPopoutActive ? 'popped-out' : ''}`}>
            <div className="nav-item" onClick={startLogout}>
                Log Out
            </div>
        </div>
    );
};

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
    storeLogout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPopover);
