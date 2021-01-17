import './prediction-filters.scss';
import React, { useState, useEffect } from 'react';
import connect from './prediction-filters.connector';
import SquadSelect, { SquadSelectOptions } from '../../components/squad-select/squad-select';
import SquadButton from '../../components/squad-button/squad-button';
import { ScheduleByLeague } from '../../types/pro-play-metadata';
import { Prediction } from '../../types/predictions';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';

interface PredictionFiltersProps {
    filters: {
        leagueId: string
        tournamentSlug: string
        stageSlug: string
        sectionName: string
    }
    schedule: ScheduleByLeague[]
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
    const { leagueId, tournamentSlug, stageSlug, sectionName } = filters;
    const [leagueFilterOptions, setLeagueFilterOptions] = useState<SquadSelectOptions[]>([]);
    const [tournamentFilterOptions, setTournamentFilterOptions] = useState<SquadSelectOptions[]>([]);
    const [stageFilterOptions, setStageFilterOptions] = useState<SquadSelectOptions[]>([]);
    const [sectionOptions, setSectionOptions] = useState<SquadSelectOptions[]>([]);

    const hasUnsavedPredictions = !isEmpty(unsavedPredictions);

    useEffect(() => {
        if (schedule.length) {
            setLeagueFilterOptions(
                schedule.map((scheduleByLeague) => ({
                    value: scheduleByLeague.leagueId,
                    label: scheduleByLeague.leagueName
                }))
            );
            updatePredictionFilter({ key: 'leagueId', value: schedule[0].leagueId });
        }
    }, [schedule]);

    useEffect(() => {
        if (filters.leagueId) {
            const leagueTournaments = schedule.find((el) => el.leagueId === leagueId);
            if (!leagueTournaments || !leagueTournaments.schedule) return;
    
            setTournamentFilterOptions(
                leagueTournaments.schedule.map((el) => ({ value: el.tournamentSlug, label: el.tournamentName }))
            );
            updatePredictionFilter({ key: 'tournamentSlug', value: leagueTournaments.schedule[0].tournamentSlug });
        }
    }, [filters.leagueId]);

    useEffect(() => {
        if (filters.leagueId && filters.tournamentSlug) {
            const leagueTournaments = schedule.find((el) => el.leagueId === leagueId);
            if (!leagueTournaments || !leagueTournaments.schedule) return;

            const tournament = leagueTournaments.schedule.find((el) => el.tournamentSlug === tournamentSlug);
            if (!tournament || !tournament.stages) return;

            setStageFilterOptions(
                tournament.stages.map((el) => ({ value: el.slug, label: el.name }))
            );
            updatePredictionFilter({ key: 'stageSlug', value: tournament.stages[0].slug });
        }
    }, [filters.tournamentSlug]);

    useEffect(() => {
        if (filters.leagueId && filters.tournamentSlug && filters.stageSlug) {
            if (sectionName === 'NO_SECTIONS') return;

            const leagueTournaments = schedule.find((el) => el.leagueId === leagueId);
            if (!leagueTournaments || !leagueTournaments.schedule) return;

            const tournament = leagueTournaments.schedule.find((el) => el.tournamentSlug === tournamentSlug);
            if (!tournament || !tournament.stages) return;

            const chosenStage = tournament.stages.find((stage) => stage.slug === stageSlug);
            if (!chosenStage || !chosenStage.sections) return;

            setSectionOptions(
                chosenStage.sections.map((section) => ({ value: section.name, label: startCase(section.name) }))
            );
            updatePredictionFilter({ key: 'sectionName', value: chosenStage.sections[0].name });
        }
    }, [filters.stageSlug]);

    const onFilterChange = (key, value) => {
        updatePredictionFilter({ key, value });

        switch (key) {
            case 'leagueId':
                updatePredictionFilter({ key: 'tournamentSlug', value: '' });
            case 'tournamentSlug':
                updatePredictionFilter({ key: 'stageSlug', value: '' });
            case 'stageSlug':
                const stageType = getStageType({
                    leagueId: key === 'leagueId' ? value : leagueId,
                    tournamentSlug: key === 'tournamentSlug' ? value : tournamentSlug,
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
                    options={leagueFilterOptions}
                    value={leagueId}
                    onChange={(value) => onFilterChange('leagueId', value)} />
                <SquadSelect
                    options={tournamentFilterOptions}
                    value={tournamentSlug}
                    onChange={(value) => onFilterChange('tournamentSlug', value)} />
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
