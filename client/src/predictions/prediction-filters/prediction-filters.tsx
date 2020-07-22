import './prediction-filters.scss';
import React, { useState, useEffect } from 'react';
import connect from './prediction-filters.connector';
import { MatchMetadata } from '../../types/pro-play-metadata';
import { Prediction, PredictionFilter } from '../../types/predictions';
import SquadSelect, { SquadSelectOptions } from '../../components/squad-select/squad-select';
import SquadButton from '../../components/squad-button/squad-button';
import {
    getUniqueLeagues,
    getUniqueTournaments,
    getUniqueStages,
    getUniqueSections,
    getMatchesByFilters,
    findNearestMatch
} from '../../utils/pro-play-metadata/pro-play-metadata.utils';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import startCase from 'lodash/startCase';

interface PredictionFiltersProps {
    filters: PredictionFilter
    matches: MatchMetadata[]
    unsavedPredictions: {
        [id: string]: Prediction
    }
    updatePredictionFilter: Function
    savePredictions: Function
}

const PredictionFilters = ({
    filters,
    matches,
    unsavedPredictions,
    updatePredictionFilter,
    savePredictions
}: PredictionFiltersProps) => {
    const [activeMatchMetadata, setActiveMatchMetadata] = useState<MatchMetadata>();
    const [leagueFilterOptions, setLeagueFilterOptions] = useState<SquadSelectOptions[]>([]);
    const [tournamentFilterOptions, setTournamentFilterOptions] = useState<SquadSelectOptions[]>([]);
    const [stageFilterOptions, setStageFilterOptions] = useState<SquadSelectOptions[]>([]);
    const [sectionOptions, setSectionOptions] = useState<SquadSelectOptions[]>([]);

    const hasUnsavedPredictions = !isEmpty(unsavedPredictions);

    useEffect(() => {
        const activeMatch = findNearestMatch(matches);
        setActiveMatchMetadata(activeMatch);
        if (matches.length) {
            const uniqueLeagues = getUniqueLeagues(matches);
            setLeagueFilterOptions(
                uniqueLeagues.map((leagueMetadata) => ({
                    value: leagueMetadata.slug,
                    label: leagueMetadata.name
                }))
            );
            updatePredictionFilter({
                key: 'leagueSlug',
                value: get(activeMatch, 'league.slug', uniqueLeagues[0].slug)
            });
        }
    }, [matches]);

    useEffect(() => {
        if (filters.leagueSlug) {
            const leagueTournaments = getUniqueTournaments({
                matches,
                leagueSlug: filters.leagueSlug
            });
            if (!leagueTournaments || leagueTournaments.length === 0) return;
    
            setTournamentFilterOptions(
                leagueTournaments.map((el) => ({ value: el.id, label: el.slug }))
            );
            updatePredictionFilter({
                key: 'tournamentId',
                value: get(activeMatchMetadata, 'tournamentMetadata.tournament.id', leagueTournaments[0].id)
            });
        }
    }, [filters.leagueSlug]);

    useEffect(() => {
        if (filters.leagueSlug && filters.tournamentId) {
            const stages = getUniqueStages({
                matches,
                leagueSlug: filters.leagueSlug,
                tournamentId: filters.tournamentId
            });
            if (!stages || stages.length === 0) return;

            setStageFilterOptions(
                stages.map((el) => ({ value: el.slug, label: el.name }))
            );
            updatePredictionFilter({
                key: 'stageSlug',
                value: get(activeMatchMetadata, 'tournamentMetadata.stage.slug', stages[0].slug)
            });
        }
    }, [filters.tournamentId]);

    useEffect(() => {
        if (filters.leagueSlug && filters.tournamentId && filters.stageSlug && filters.sectionName !== 'NO_SECTIONS') {
            const sections = getUniqueSections({
                matches,
                leagueSlug: filters.leagueSlug,
                tournamentId: filters.tournamentId,
                stageSlug: filters.stageSlug
            });
            if (!sections || sections.length === 0) return;

            setSectionOptions(
                sortBy(
                    sections.map((section) => ({ value: section.name, label: startCase(section.name) })),
                    'value'
                )
            );
            updatePredictionFilter({
                key: 'sectionName',
                value: get(activeMatchMetadata, 'tournamentMetadata.section.name', sections[0].name)
            });
        }
    }, [filters.stageSlug]);

    const onFilterChange = (key, value) => {
        updatePredictionFilter({ key, value });

        switch (key) {
            case 'leagueSlug':
                updatePredictionFilter({ key: 'tournamentId', value: '' });
            case 'tournamentId':
                updatePredictionFilter({ key: 'stageSlug', value: '' });
            case 'stageSlug':
                const applicableMatch = getMatchesByFilters(matches, {
                    'league.slug': key === 'leagueSlug' ? value : filters.leagueSlug,
                    'tournamentMetadata.tournament.id': key === 'tournamentId' ? value : filters.tournamentId,
                    'tournamentMetadata.stage.slug': key === 'stageSlug' ? value : filters.stageSlug
                });
                const stageType = get(applicableMatch, 'type');
                const selectionType = stageType === 'bracket' ? 'NO_SECTIONS' : '';
                updatePredictionFilter({ key: 'sectionName', value: selectionType });
        }
    };

    return (
        <div className="prediction-filters">
            <div className="prediction-dropdowns">
                <SquadSelect
                    options={leagueFilterOptions}
                    value={filters.leagueSlug}
                    onChange={(value) => onFilterChange('leagueSlug', value)} />
                <SquadSelect
                    options={tournamentFilterOptions}
                    value={filters.tournamentId}
                    onChange={(value) => onFilterChange('tournamentId', value)} />
                <SquadSelect
                    options={stageFilterOptions}
                    value={filters.stageSlug}
                    onChange={(value) => onFilterChange('stageSlug', value)} />
                {
                    filters.sectionName !== 'NO_SECTIONS' &&
                        <SquadSelect
                            options={sectionOptions}
                            value={filters.sectionName}
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
