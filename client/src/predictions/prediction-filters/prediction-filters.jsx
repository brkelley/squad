import React, { useState } from 'react';
import { connect } from 'react-redux';
import './prediction-filters.scss';
import { updatePredictionFilter, savePredictions } from '../../store/predictions/predictions.actions.js';

import Dropdown from '../../components/dropdown/dropdown.jsx';
import SquadButton from '../../components/button/button.jsx';
import moment from 'moment';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';

const PredictionFilters = props => {
    const [leagueDropdown, setLeagueDropdown] = useState(get(props.filters, 'leagueId'));
    const [blockDropdown, setBlockDropdown] = useState(get(props.filters, 'blockName'));
    const [isSaving, setIsSaving] = useState(false);

    const dropdownMap = {
        leagueId: setLeagueDropdown,
        blockName: setBlockDropdown
    };

    const handleChange = async (change, dropdown) => {
        props.updatePredictionFilter({ key: dropdown, value: change });
        dropdownMap[dropdown](change);

        if (dropdown === 'leagueId') updateCurrentActiveBlock();
    };

    const getLeagueOptions = () => {
        return get(props, 'leagues', []).map(league => ({ value: league.id, label: league.name }));
    };

    const getBlockOptions = () => {
        return uniq(get(props, `schedule.${leagueDropdown}`, []).map(el => el.blockName)).map(el => ({
            label: el,
            value: el
        }));
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            await props.savePredictions();
        } catch (error) {
            console.error(error);
        }
        setIsSaving(false);
    }

    const updateCurrentActiveBlock = () => {
        const currentDate = moment().valueOf();
        const nextBlock = get(props, `schedule.${leagueDropdown}`, []).find(match => {
            const matchEpoch = moment(match.startTime).valueOf();
            return currentDate < matchEpoch;
        });
        if (nextBlock) {
            setBlockDropdown(nextBlock.blockName);
            props.updatePredictionFilter({ key: 'blockName', value: nextBlock.blockName });
        }
    };

    if (!blockDropdown) updateCurrentActiveBlock();

    return (
        <div className="prediction-filters-wrapper">
            <div className="prediction-dropdowns">
                <div className="prediction-filter-wrapper">
                    <Dropdown
                        value={leagueDropdown}
                        options={getLeagueOptions()}
                        onChange={e => handleChange(e.target.value, 'leagueId')} />
                </div>
                <div className="prediction-filter-wrapper">
                    <Dropdown
                        value={blockDropdown}
                        options={getBlockOptions()}
                        onChange={e => handleChange(e.target.value, 'blockName')} />
                </div>
            </div>
            <div className="prediction-save-button">
                {props.hasUnsavedPredictions &&
                    (<SquadButton
                        buttonLabel={'SAVE'}
                        loading={isSaving}
                        click={saveChanges} />)
                }
            </div>
        </div>
    );
};

const mapStateToProps = ({ predictionReducer }) => ({
    hasUnsavedPredictions: !isEmpty(predictionReducer.unsavedPredictions)
});

const mapDispatchToProps = dispatch => ({
    updatePredictionFilter: predictionFilter => dispatch(updatePredictionFilter(predictionFilter)),
    savePredictions: () => dispatch(savePredictions())
});

export default connect(mapStateToProps, mapDispatchToProps)(PredictionFilters);
