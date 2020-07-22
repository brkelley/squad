import { MatchMetadata } from '../types/pro-play-metadata';
import moment, { Moment } from 'moment';
import cloneDeep from 'lodash/cloneDeep';

const MATCH_TIME_CARDINALITY = 70;

export const convertNumberToCardinal = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j == 1 && k != 11) {
        return num + 'st';
    }
    if (j == 2 && k != 12) {
        return num + 'nd';
    }
    if (j == 3 && k != 13) {
        return num + 'rd';
    }

    return num + 'th';
};

export interface GroupedMatches {
    startTime: Moment;
    endTime: Moment;
    matches: MatchMetadata[];
};
export const groupMatchesByTime = (matches: MatchMetadata[]) => {
    const groupedMatches = matches.reduce((acc: GroupedMatches[], match: MatchMetadata) => {
        const matchStartTime = moment(match.startTime);
        const applicableGroup = acc.find((el) => {
            const btwn = matchStartTime.isBetween(el.startTime, el.endTime);
            return btwn;
        });

        if (applicableGroup) {
            applicableGroup.matches.push(match);
            applicableGroup.startTime = (matchStartTime.isBefore(applicableGroup.startTime)
                ? cloneDeep(matchStartTime).subtract(MATCH_TIME_CARDINALITY, 'hours')
                : applicableGroup.startTime);
            applicableGroup.endTime = (matchStartTime.isAfter(applicableGroup.endTime)
                ? cloneDeep(matchStartTime).add(MATCH_TIME_CARDINALITY, 'hours')
                : applicableGroup.endTime);
        } else {
            acc.push({
                startTime: cloneDeep(matchStartTime).subtract(MATCH_TIME_CARDINALITY, 'hours'),
                endTime: cloneDeep(matchStartTime).add(MATCH_TIME_CARDINALITY, 'hours'),
                matches: [match]
            });
        }

        return acc;
    }, []);

    return groupedMatches;
};
