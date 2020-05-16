import './homepage.scss';
import * as React from 'react';
import { useEffect } from 'react';
import connectHomepage from './homepage.connector.js';

import LoadingIndicator from '../components/loading-indicator/loading-indicator.jsx';
import AchievementWidget from './achievement-widget/achievement-widget.tsx';

const Homepage = ({ getAllUsers, userFetching, user}) => {
    useEffect(() => {
        getAllUsers();
    }, []);

    const renderMainHomePage = () => {
        if (userFetching) {
            return (
                <div className="loading-wrapper">
                    <LoadingIndicator />
                </div>
            );
        }
    
        return (
            <div className="homepage-wrapper">
                <AchievementWidget
                    user={user} />
            </div>
        );
    };

    return renderMainHomePage();
};

export default connectHomepage(Homepage);
