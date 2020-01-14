import React, { useState, useEffect } from 'react';
import './prediction-filters.scss';

import Dropdown from '../../components/dropdown/dropdown.jsx';
import get from 'lodash/get';

export default function PredictionFilters (props) {
    const [dropdown, setDropdown] = useState(get(props.filters, 'leagueId'));

    const handleChange = async (change, dropdown) => {
        props.updatePredictionFilter({ key: dropdown, value: change });
        setDropdown(change);
    };

    const getOptions = () => {
        return get(props, 'leagues', []).map(league => ({ value: league.id, label: league.name }));
    };

    return (
        <div className="prediction-filters-wrapper">
            <Dropdown
                value={dropdown}
                options={getOptions()}
                onChange={e => handleChange(e.target.value, 'leagueId')} />
        </div>
    );
};
