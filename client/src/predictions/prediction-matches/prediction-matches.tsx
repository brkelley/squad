import './prediction-matches.scss';
import React from 'react';
import { ScheduleMatch, ScheduleSection } from '../../types/pro-play-metadata';
import SingleMatch from './single-match/single-match';
import moment from 'moment';
import groupBy from 'lodash/groupBy';

interface PredictionMatchesProps {
    section: ScheduleSection
    type: string
};
export default ({
    section,
    type
}: PredictionMatchesProps) => {
    const renderNoMatches = () => {
        return (
            <div className="predictions-matches">
                No Matches
            </div>
        )
    };

    const renderMatchesSeparatedByTime = (matches: ScheduleMatch[]) => {
        const matchesGroupedByTime = groupBy(matches, (match) => moment(match.startTime).startOf('day').format('MM-DD'));
        
        return Object.entries(matchesGroupedByTime).map(([key, matches]) => {
            const firstGameMoment = moment(matches[0].startTime);

            return (
                <div
                    className="matches-by-day"
                    key={key}>
                    <div className="matches-date-label">
                        {firstGameMoment.format('MMMM Do')}
                    </div>
                    {
                        ...matches.map((match) => (
                            <SingleMatch
                                key={match.id}
                                matchMetadata={match} />
                        ))
                    }
                </div>
            )
        });
    };

    if (type === 'groups') {
        const matches = section.matches;

        if (!matches || matches.length === 0) {
            return renderNoMatches();
        }

        return (
            <div className="predictions-matches">
                {
                    ...renderMatchesSeparatedByTime(matches)
                }
            </div>
        );
    }

    return <></>;
};