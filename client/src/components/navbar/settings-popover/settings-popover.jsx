import './settings-popover.scss';
import React, { useRef, useEffect } from 'react';

const SettingsPopover = ({
    user,
    settingsPopoutActive,
    logout,
    collapseSettingsPopover,
    history,
    toggleButton
}) => {
    const node = useRef();

    const redirectToUserDetails = () => {
        collapseSettingsPopover(false);
        history.push(`/users/${user.id}`);
    }

    const handleClickEvent = event => {
        const clickedToggle = toggleButton.current.contains(event.target);
        if (!node.current.contains(event.target) && !clickedToggle) {
            document.removeEventListener('mousedown', handleClickEvent);
            collapseSettingsPopover(false);
        }
    };

    const handleLogout = () => {
        document.removeEventListener('mousedown', handleClickEvent);
        logout();
    }

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
                <div className="nav-item" onClick={handleLogout}>
                    Log Out
                </div>
            </div>
            </div>
        </div>
    );
};

export default SettingsPopover;
