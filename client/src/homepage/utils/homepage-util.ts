import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import flatMap from 'lodash/flatMap';

import { ScheduleMatchMetadata } from '../../types/pro-play-metadata';

export interface MatchesByDate {
    startTime: moment.Moment
    endTime: moment.Moment
    index: number
    matches: ScheduleMatchMetadata[]
}

interface sortMatchesByDateProps {
    schedule: ScheduleMatchMetadata[]
}

const MATCH_TIME_CARDINALITY = 55;

export function sortMatchesByDate ({ schedule }: sortMatchesByDateProps) {
    const combinedMatches = flatMap(Object.values(schedule));

    const matchesByTimeChunks: MatchesByDate[] = [];

    for (let i = 0; i < combinedMatches.length; i++) {
        const currentMatch = combinedMatches[i];
        const currentMatchTime = moment(currentMatch.startTime);

        const applicableChunk = matchesByTimeChunks.find((chunk) => {
            const chunkExtendedStart = cloneDeep(chunk.startTime).subtract(MATCH_TIME_CARDINALITY, 'hours');
            const chunkExtendedEnd = cloneDeep(chunk.endTime).add(MATCH_TIME_CARDINALITY, 'hours');

            return currentMatchTime.isBetween(chunkExtendedStart, chunkExtendedEnd);
        });

        if (applicableChunk) {
            if (!applicableChunk.matches) applicableChunk.matches = [];
            applicableChunk.matches.push(currentMatch);

            if (applicableChunk.startTime.isAfter(currentMatchTime)) {
                applicableChunk.startTime = currentMatchTime;
            }
            if (applicableChunk.endTime.isBefore(currentMatchTime)) {
                applicableChunk.endTime = currentMatchTime;
            }
        } else {
            matchesByTimeChunks.push({
                startTime: currentMatchTime,
                endTime: currentMatchTime,
                matches: [ currentMatch ],
                index: -1
            });
        }
    }

    return matchesByTimeChunks
        .sort((a, b) => a.startTime.unix() - b.startTime.unix())
        .map((el, index) => ({ ...el, index }));
};


