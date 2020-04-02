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

const PredictionFilters = ({ filters, schedule, hasUnsavedPredictions, leagues = [], savePredictions, updatePredictionFilter }) => {
    const [leagueDropdown, setLeagueDropdown] = useState(get(filters, 'leagueId'));
    const [blockDropdown, setBlockDropdown] = useState(get(filters, 'blockName'));
    const [isSaving, setIsSaving] = useState(false);

    const dropdownMap = {
        leagueId: setLeagueDropdown,
        blockName: setBlockDropdown
    };

    const getLeagueOptions = () => {
        return leagues.map(league => ({ value: league.id, label: league.name }));
    };

    const getBlockOptions = () => {
        const leagueSchedule = get(schedule, leagueDropdown, []);
        return uniq(leagueSchedule.map(el => el.blockName)).map(el => ({
            label: el,
            value: el
        }));
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            await savePredictions();
        } catch (error) {
            console.error(error);
        }
        setIsSaving(false);
    }

    const updateCurrentActiveBlock = () => {
        const currentDate = moment().valueOf();
        const leagueSchedule = get(schedule, leagueDropdown, []);
        const nextBlock = leagueSchedule.find(match => {
            const matchEpoch = moment(match.startTime).valueOf();
            return currentDate < matchEpoch;
        });
        if (nextBlock) {
            setBlockDropdown(nextBlock.blockName);
            updatePredictionFilter({ key: 'blockName', value: nextBlock.blockName });
        }
    };

    const handleChange = async (change, dropdown) => {
        dropdownMap[dropdown](change);
        updatePredictionFilter({ key: dropdown, value: change });

        if (dropdown === 'leagueId') updateCurrentActiveBlock();
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
                {hasUnsavedPredictions
                    && (
                        <SquadButton
                            buttonLabel="SAVE"
                            loading={isSaving}
                            click={saveChanges}
                        />
                    )
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
