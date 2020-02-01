import './error-indicator.scss';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const ErrorIndicator = props => {
    return (
        <div className="error-indicator-wrapper">
            <div className="error-icon-wrapper">
                <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
            </div>
            <div className="error-message-main">
                Oops!
            </div>
            <div className="error-message">
                Something went wrong, please try again later.
            </div>
        </div>
    );
};

export default ErrorIndicator;
