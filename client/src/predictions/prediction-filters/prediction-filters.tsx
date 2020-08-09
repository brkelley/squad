import './prediction-filters.scss';
import React, { useState, useEffect } from 'react';
import connect from './prediction-filters.connector';
import SquadSelect, { SquadSelectOptions } from '../../components/squad-select/squad-select';
import SquadButton from '../../components/squad-button/squad-button';
import { TournamentSchedule } from '../../types/pro-play-metadata';
import { Prediction } from '../../types/predictions';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';

interface PredictionFiltersProps {
    filters: {
        tournamentId: string
        stageSlug: string
        sectionName: string
    }
    schedule: TournamentSchedule[]
    unsavedPredictions: {
        [id: string]: Prediction
    }
    getStageType: Function
    updatePredictionFilter: Function
    savePredictions: Function
}

const PredictionFilters = ({
    filters,
    schedule,
    unsavedPredictions,
    getStageType,
    updatePredictionFilter,
    savePredictions
}: PredictionFiltersProps) => {
    const { tournamentId, stageSlug, sectionName } = filters;
    const [tournamentFilterOptions, setTournamentFilterOptions] = useState<SquadSelectOptions[]>([]);
    const [stageFilterOptions, setStageFilterOptions] = useState<SquadSelectOptions[]>([]);
    const [sectionOptions, setSectionOptions] = useState<SquadSelectOptions[]>([]);

    const hasUnsavedPredictions = !isEmpty(unsavedPredictions);

    useEffect(() => {
        if (schedule.length) {
            setTournamentFilterOptions(
                schedule.map((tournament) => ({
                    value: tournament.leagueId,
                    label: tournament.leagueName
                }))
            );
            updatePredictionFilter({ key: 'tournamentId', value: schedule[0].leagueId });
        }
    }, [schedule]);

    useEffect(() => {
        if (filters.tournamentId) {
            const tournament = schedule.find((el) => el.leagueId === tournamentId);
            if (!tournament || !tournament.schedule) return;
    
            setStageFilterOptions(
                tournament.schedule.map((el) => ({ value: el.slug, label: el.name }))
            );
            updatePredictionFilter({ key: 'stageSlug', value: tournament.schedule[0].slug });
        }
    }, [filters.tournamentId]);

    useEffect(() => {
        if (filters.tournamentId && filters.stageSlug) {
            if (sectionName === 'NO_SECTIONS') return;

            const tournament = schedule.find((el) => el.leagueId === tournamentId);
            if (!tournament || !tournament.schedule) return;

            const chosenStage = tournament.schedule.find((stage) => stage.slug === stageSlug);
            if (!chosenStage || !chosenStage.sections) return;

            setSectionOptions(
                chosenStage.sections.map((section) => ({ value: section.name, label: startCase(section.name) }))
            );
            updatePredictionFilter({ key: 'sectionName', value: chosenStage.sections[0].name });
        }
    }, [filters.stageSlug]);

    useEffect(() => {
        if (filters.tournamentId && filters.stageSlug) {
            const tournament = schedule.find((el) => el.leagueId === tournamentId);
            if (!tournament || !tournament.schedule) return;

            const regularSeasonMatches = tournament.schedule.find((stage) => stage.slug === stageSlug);
            if (!regularSeasonMatches || !regularSeasonMatches.sections) return;
        }
    }, [filters]);

    const onFilterChange = (key, value) => {
        updatePredictionFilter({ key, value });

        switch (key) {
            case 'tournamentId':
                updatePredictionFilter({ key: 'stageSlug', value: '' });
            case 'stageSlug':
                const stageType = getStageType({
                    tournamentId: key === 'tournamentId' ? value : tournamentId,
                    stageSlug: key === 'stageSlug' ? value : stageSlug
                });
                const selectionType = stageType === 'bracket' ? 'NO_SECTIONS' : '';
                updatePredictionFilter({ key: 'sectionName', value: selectionType });
        }
    };

    return (
        <div className="prediction-filters">
            <div className="prediction-dropdowns">
                <SquadSelect
                    options={tournamentFilterOptions}
                    value={tournamentId}
                    onChange={(value) => onFilterChange('tournamentId', value)} />
                <SquadSelect
                    options={stageFilterOptions}
                    value={stageSlug}
                    onChange={(value) => onFilterChange('stageSlug', value)} />
                {
                    sectionName !== 'NO_SECTIONS' &&
                        <SquadSelect
                            options={sectionOptions}
                            value={sectionName}
                            onChange={(value) => onFilterChange('sectionName', value)} />
                }
            </div>
            <div className="prediction-filter-save">
                {
                    hasUnsavedPredictions &&
                        <SquadButton
                            label="Save"
                            click={savePredictions} />
                }
            </div>
        </div>
    );
};

export default connect(PredictionFilters);
