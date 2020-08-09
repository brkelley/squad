import './squad-tab.scss';
import React, { useState } from 'react';

import get from 'lodash/get';

export default function SquadTab ({
    tabContents
}) {
    const [activeTab, setActiveTab] = useState<number>(0);

    const renderTabs = () => {
        return tabContents.map(({ label }, index) => (
            <div
                className={`squad-tab ${activeTab === index ? 'active-tab' : ''}`}
                key={index}
                onClick={() => setActiveTab(index)}>
                {label}
            </div>
        ))
    };
    
    const renderTabContent = () => {
        return get(tabContents, `[${activeTab}].content`);
    };

    return (
        <div className="squad-tabs">
            <div className="squad-tab-labels">
                {...renderTabs()}
            </div>
            <div className="squad-tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
};
