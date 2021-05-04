import './prediction-matches.scss';
import React from 'react';
import { MatchMetadata } from '../../types/pro-play-metadata';
import SingleMatch from './single-match/single-match';
import moment from 'moment';
import groupBy from 'lodash/groupBy';

interface PredictionMatchesProps {
    sectionMatches: MatchMetadata[]
};
export default ({
    sectionMatches
}: PredictionMatchesProps) => {
    const renderNoMatches = () => {
        return (
            <div className="predictions-matches">
                No Matches
            </div>
        )
    };

    const renderMatchesSeparatedByTime = (matches: MatchMetadata[]) => {
        const matchesGroupedByTime = groupBy(matches, (match) => moment(match.startTime).startOf('day').format('MM-DD'));
        
        return Object.entries(matchesGroupedByTime)
            .sort(([nameA, matchesA], [nameB, matchesB]) => {
                return new Date(matchesA[0].startTime).getTime() - new Date(matchesB[0].startTime).getTime();
            })
            .map(([key, matches]) => {
                const firstGameMoment = moment(matches[0].startTime);

                return (
                    <div
                        className="matches-by-day"
                        key={key}>
                        <div className="matches-date-label">
                            {firstGameMoment.format('MMMM Do')}
                        </div>
                        {
                            ...matches
                                .sort((matchA, matchB) => {
                                    return new Date(matchA.startTime).getTime() - new Date(matchB.startTime).getTime();
                                })
                                .map((match) => (
                                    <SingleMatch
                                        key={match.match.id}
                                        matchMetadata={match} />
                                ))
                        }
                    </div>
                )
            });
    };

    if (!sectionMatches || sectionMatches.length === 0) {
        return renderNoMatches();
    }

    return (
        <div className="predictions-matches">
            {
                ...renderMatchesSeparatedByTime(sectionMatches)
            }
        </div>
    );
};