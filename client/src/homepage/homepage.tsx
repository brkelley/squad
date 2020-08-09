import './homepage.scss';
import React from 'react';

import ProPlayDashboard from './pro-play-dashboard/pro-play-dashboard';
import SquadTab from '../components/squad-tab/squad-tab';

const Homepage = ({
}) => {
    const tabContents = [
        {
            label: 'Pro Play Predictions',
            content: <ProPlayDashboard />
        }
    ];

    return (
        <div className="homepage-wrapper">
            <SquadTab
                tabContents={tabContents} />
        </div>
    );
};

export default Homepage;
