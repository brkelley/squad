import './settings-popover.scss';
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { logout } from '../../../store/user/user.actions.js';

const SettingsPopover = props => {
    const node = useRef();
    const { user, settingsPopoutActive, storeLogout } = props;

    const startLogout = () => {
        props.collapseSettingsPopover(false);
        storeLogout();
        props.history.push('/login');
    };

    const redirectToUserDetails = () => {
        props.collapseSettingsPopover(false);
        props.history.push(`/users/${props.user.id}`);
    }

    const handleClickEvent = event => {
        const clickedToggle = props.toggleButton.current.contains(event.target);
        if (!node.current.contains(event.target) && !clickedToggle) {
            props.collapseSettingsPopover(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickEvent);
        return () => {
            document.removeEventListener('mousedown', handleClickEvent);
        }
    }, []);

    return (
        <div
            className={`nav-popout-wrapper ${settingsPopoutActive ? 'popped-out' : ''}`}
            ref={node}>
            <div className="nav-popout">
            <div className="nav-username">
                {user.summonerName}
            </div>
            <hr className="nav-popout-separator" />
            <div className="nav-item-wrapper">
                <div className="nav-item" onClick={redirectToUserDetails}>
                    Edit
                </div>
                <div className="nav-item" onClick={startLogout}>
                    Log Out
                </div>
            </div>
            </div>
        </div>
    );
};

const mapStateToProps = ({ userReducer }) => ({
    user: userReducer.user
});
const mapDispatchToProps = dispatch => ({
    storeLogout: () => dispatch(logout())
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SettingsPopover)
);
