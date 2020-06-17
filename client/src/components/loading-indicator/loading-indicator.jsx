import './loading-indicator.scss';

import React from 'react';

export default function LoadingIndicator ({ theme = 'dark' } = {}) {
    const lightMode = theme === 'light';

    return (
        <div className={`loading-indicator ${lightMode ? 'light-mode' : ''}`}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};
