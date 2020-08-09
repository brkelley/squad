import { TournamentSchedule, ScheduleMatch } from '../../types/pro-play-metadata';

import moment, { Moment } from 'moment';

const TIME_CARDINALITY = 80 * 60 * 60 * 1000;

interface FlattenMatchesProps {
    schedule: TournamentSchedule
}

export function flattenMatches ({ schedule }: FlattenMatchesProps) {
    // if (!schedule) {
    //     return [];
    // }

    // const matches: ScheduleMatch[] = [];

    // Object.values(schedule).forEach((scheduleByLeague) => {
    //     scheduleByLeague.stages.forEach((stage) => {
    //         stage.sections.forEach((section) => {
    //             matches.push(...section.matches);
    //         });
    //     });
    // });

    // return matches;
};


export function sortMatchesByTime ({ matches }: { matches: ScheduleMatch[] }) {
    // const matchesSortedByTime = matches.sort((matchA, matchB) => {
    //     return moment(matchB.startTime).valueOf() - moment(matchA.startTime).valueOf();
    // });

    // interface AccumulatorInterface {
    //     startTime: Moment
    //     endTime: Moment
    //     matches: ScheduleMatch[]
    // }

    // const groupedMatches = matchesSortedByTime.reduce((acc: AccumulatorInterface[], match) => {
    //     const matchStartTime = moment(match.startTime);
    //     const matchGroup = acc.find((group) => {
    //         if (matchStartTime.isBetween(group.startTime, group.endTime)) return true;

    //         const isWithinCardinality =
    //             Math.abs(group.startTime.valueOf() - matchStartTime.valueOf()) <= TIME_CARDINALITY ||
    //             Math.abs(group.endTime.valueOf() - matchStartTime.valueOf()) <= TIME_CARDINALITY;

    //         return isWithinCardinality;
    //     });

    //     if (matchGroup) {
    //         matchGroup.matches.push(match);
    //         matchGroup.startTime = matchGroup.startTime.isBefore(matchStartTime) ? matchGroup.startTime : matchStartTime;
    //         matchGroup.endTime = matchGroup.endTime.isAfter(matchStartTime) ? matchGroup.endTime : matchStartTime;
    //     } else {
    //         acc.push({
    //             startTime: matchStartTime,
    //             endTime: matchStartTime,
    //             matches: [match]
    //         });
    //     }

    //     return acc;
    // }, []);

    // return groupedMatches.map((el) => el.matches);
}
