import './predictions.scss';
import React, { useState, useEffect } from 'react';
import connectPredictions from './predictions.connector';
import { MatchMetadata } from '../types/pro-play-metadata';
import { User } from '../types/user';
import { Prediction, PredictionFilter } from '../types/predictions';
import LoadingIndicator from '../components/loading-indicator/loading-indicator';
import PredictionFilters from './prediction-filters/prediction-filters';
import PredictionMatches from './prediction-matches/prediction-matches';
import PlayoffBracket from '../components/playoff-bracket/playoff-bracket';
import SeriesMatch from './prediction-matches/series-match/series-match';
import { getMatchesByFilters } from '../utils/pro-play-metadata/pro-play-metadata.utils';
import get from 'lodash/get';

interface PredictionsProps {
    filters: PredictionFilter
    matches: MatchMetadata[]
    users: User[]
    predictionMap: {
        [userId: string]: {
            [matchId: string]: Prediction
        }
    }
    loadAllMatches: Function
    loadAllPredictions: Function
    updatePredictionFilter: Function
}
const Predictions = ({
    filters,
    matches,
    users,
    predictionMap,
    loadAllMatches,
    loadAllPredictions,
    updatePredictionFilter
}: PredictionsProps) => {
    const [predictionsLoading, setPredictionsLoading] = useState<boolean>(true);
    const [filtersSet, setFiltersSet] = useState<boolean>(false);

    useEffect(() => {
        loadAllPredictions();
        loadAllMatches().then(() => {
            setPredictionsLoading(false);
        })
    }, []);

    useEffect(() => {
        setFiltersSet(filters.leagueSlug !== '' && filters.tournamentId !== '' && filters.stageSlug !== '' && filters.sectionName !== '');
    }, [filters]);

    const renderContentFromFilters = () => {
        if (filters.leagueSlug === '' || filters.tournamentId === '' || filters.stageSlug === '' || filters.sectionName === '') return;
        const { leagueSlug, tournamentId, stageSlug, sectionName } = filters;

        const stageMatches = getMatchesByFilters(matches, {
            league: {
                slug: leagueSlug
            },
            tournamentMetadata: {
                tournament: {
                    id: tournamentId
                },
                stage: {
                    slug: stageSlug
                }
            }
        });
        const stageType = get(stageMatches[0], 'tournamentMetadata.stage.type');

        if (!stageType) return;

        if (stageType === 'bracket') {
            const dropdownContent = (activeSectionMatches: MatchMetadata[]) => {
                if (!activeSectionMatches || activeSectionMatches.length === 0) return;

                return (
                    <div className="section-prediction-container">
                        {
                            ...activeSectionMatches.map((match) => {
                                const [redSide, blueSide] = match.match.teams;

                                return (
                                    <div
                                        key={match.match.id}
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
                    playoffMatches={stageMatches}
                    users={users}
                    predictionMap={predictionMap}
                    showActiveSection={true}
                    dropdownContent={dropdownContent} />
            );
        } else if (stageType === 'groups' || stageType === 'split') {
            const sectionMatches = getMatchesByFilters(matches, {
                league: {
                    slug: leagueSlug
                },
                tournamentMetadata: {
                    tournament: {
                        id: tournamentId
                    },
                    stage: {
                        slug: stageSlug
                    },
                    section: {
                        name: sectionName
                    }
                }
            });
            if (!sectionMatches || sectionMatches.length === 0) return;

            return (
                <PredictionMatches
                    sectionMatches={sectionMatches} />
            );
        } else return;
    };

    const renderContent = () => {
        return (
            <div className="predictions-wrapper">
                <PredictionFilters
                    filters={filters}
                    matches={matches}
                    updatePredictionFilter={updatePredictionFilter} />
                <div className="filter-space" />
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
