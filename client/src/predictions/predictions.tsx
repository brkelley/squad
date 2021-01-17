import './predictions.scss';
import React, { useState, useEffect } from 'react';
import connectPredictions from './predictions.connector';
import { ScheduleByLeague, ScheduleSection, TournamentSchedule } from '../types/pro-play-metadata';
import LoadingIndicator from '../components/loading-indicator/loading-indicator';
import PredictionFilters from './prediction-filters/prediction-filters';
import PredictionMatches from './prediction-matches/prediction-matches';
import PlayoffBracket from '../components/playoff-bracket/playoff-bracket';
import SeriesMatch from './prediction-matches/series-match/series-match';
import { User } from '../types/user';
import { Prediction } from '../types/predictions';

interface PredictionsProps {
    filters: {
        leagueId: string;
        tournamentSlug: string;
        stageSlug: string;
        sectionName: string;
    },
    schedule: ScheduleByLeague[];
    users: User[];
    predictionMap: {
        [userId: string]: {
            [matchId: string]: Prediction
        }
    };
    loadAllSchedule: Function;
    loadAllPredictions: Function;
    updatePredictionFilter: Function;
}
const Predictions = ({
    filters,
    schedule,
    users,
    predictionMap,
    loadAllSchedule,
    loadAllPredictions,
    updatePredictionFilter
}: PredictionsProps) => {
    const [predictionsLoading, setPredictionsLoading] = useState<boolean>(true);
    const [filtersSet, setFiltersSet] = useState<boolean>(false);
    useEffect(() => {
        Promise.all([loadAllPredictions(), loadAllSchedule()])
            .then(() => {
                setPredictionsLoading(false);
            });
    }, []);

    useEffect(() => {
        setFiltersSet(filters.leagueId !== '' && filters.tournamentSlug !== '' && filters.stageSlug !== '' && filters.sectionName !== '');
    }, [filters]);

    const renderContentFromFilters = () => {
        if (filters.leagueId === '' || filters.tournamentSlug === '' || filters.stageSlug === '' || filters.sectionName === '') return;
        const { leagueId, tournamentSlug, stageSlug, sectionName } = filters;
        const selectedLeague = schedule.find((league) => league.leagueId === leagueId);
        if (!selectedLeague) return;
        const selectedTournament = selectedLeague.schedule.find((tournament) => tournament.tournamentSlug === tournamentSlug);
        if (!selectedTournament) return;
        const selectedStage = selectedTournament.stages.find((stage) => stage.slug === stageSlug);
        if (!selectedStage) return;

        if (selectedStage.type === 'bracket') {
            const dropdownContent = (activeSection: ScheduleSection) => {
                if (!activeSection) return;

                return (
                    <div className="section-prediction-container">
                        {
                            ...activeSection.matches.map((match) => {
                                const [redSide, blueSide] = match.teams;

                                return (
                                    <div
                                        key={match.id}
                                        className="series-match-container">
                                        <div className="series-match-label">
                                            {redSide.name} vs {blueSide.name}
                                        </div>
                                        <SeriesMatch
                                            redSide={redSide}
                                            blueSide={blueSide}
                                            matchMetadata={match}
                                            predictionMetadata={{}}
                                            saveOrUpdatePrediction={() => {}} />
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            };

            return (
                <PlayoffBracket
                    playoffStage={selectedStage}
                    users={users}
                    predictionMap={predictionMap}
                    showActiveSection={true}
                    dropdownContent={dropdownContent} />
            );
        } else if (selectedStage.type === 'groups' || selectedStage.type === 'split') {
            const selectedSection = selectedStage.sections.find((section) => section.name === sectionName);
            if (!selectedSection) return;

            return (
                <PredictionMatches
                    section={selectedSection}
                    type={selectedStage.type} />
            );
        } else return;
    };

    const renderContent = () => {
        return (
            <div className="predictions-wrapper">
                <PredictionFilters
                    filters={filters}
                    schedule={schedule}
                    updatePredictionFilter={updatePredictionFilter} />
                {
                    filtersSet && renderContentFromFilters()
                }
            </div>
        );
    };

    if (predictionsLoading) {
        return (
            <div className="loading-indicator-wrapper">
                <LoadingIndicator />
            </div>
        )
    }

    return (
        <div className="predictions-wrapper">
            {renderContent()}
        </div>
    );
};

export default connectPredictions(Predictions);
