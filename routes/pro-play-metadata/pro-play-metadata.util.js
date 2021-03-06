const get = require('lodash/get');
const last = require('lodash/last');

const MATCH_CARDINALITY = 3 * 24 * 60 * 60 * 1000; // 3 days into milliseconds
const tournamentSlugMap = {
    'lcs_2021_lockin': 'Lock-In Tournament',
    'lec_2021_split1': 'LEC - Spring 2021',
    'lcs_2021': 'LCS Regular Season',
    'mss_2021': 'Mid-Season Showdown'
};

module.exports.convertTournamentSlug = (slug) => {
    return tournamentSlugMap[slug];
};

module.exports.populateMatchTimes = (schedule, matchMetadata) => {
    const stages = schedule.stages.map((stage) => {
        const sections = stage.sections.map((section) => {
            const matches = section.matches.reduce((allMatches, match) => {

                const activeMatchMetadata = get(matchMetadata, match.id);

                // This is because LCS doesn't always add their start times???????
                // Stupid new split format.
                if (!activeMatchMetadata || !activeMatchMetadata.startTime) return allMatches;

                const supplementalData = (activeMatchMetadata)
                    ? {
                        startTime: activeMatchMetadata.startTime,
                        blockName: activeMatchMetadata.blockName,
                        strategy: activeMatchMetadata.match.strategy,
                        league: activeMatchMetadata.league
                    } : {};

                allMatches.push({
                    ...match,
                    ...supplementalData
                });

                return allMatches;
            }, []);

            if (matches.length === 0) {
                return {
                    ...section,
                    matches: [],
                    startTime: 0,
                    endTime: 0
                }
            }

            const sortedMatches = matches.sort((a, b) => {
                const aTimestamp = new Date(a.startTime).getTime();
                const bTimestamp = new Date(b.startTime).getTime();

                return aTimestamp - bTimestamp;
            });

            const startTime = sortedMatches[0].startTime;
            const endTime = last(sortedMatches).startTime;

            return {
                ...section,
                matches: sortedMatches,
                startTime,
                endTime
            };
        });

        const sortedSections = sections.sort((a, b) => {
            const aTimestamp = new Date(a.startTime).getTime();
            const bTimestamp = new Date(b.startTime).getTime();

            return aTimestamp - bTimestamp;
        });

        const startTime = sortedSections[0].startTime;
        const endTime = last(sortedSections).endTime;

        return {
            ...stage,
            sections: sortedSections,
            startTime,
            endTime
        };
    });

    const sortedStages = stages.sort((a, b) => {
        const aTimestamp = new Date(a.startTime).getTime();
        const bTimestamp = new Date(b.startTime).getTime();

        return aTimestamp - bTimestamp;
    });
    
    const startTime = sortedStages[0].startTime;
    const endTime = last(sortedStages).endTime;

    return {
        ...schedule,
        stages: sortedStages,
        startTime,
        endTime
    };
};

module.exports.convertRegularSeasonStage = (stage) => {
    const matches = get(stage.sections.find((el) => ['Round Robin', 'Regular Season'].includes(el.name)), 'matches');

    let groupedWeeks = groupMatchesIntoWeeks(matches);

    return {
        name: 'Regular Season',
        type: 'split',
        slug: 'regular_season',
        // really there should only be one section for regular season
        // sections: stage.sections.map((section) => {
        sections: groupedWeeks.map((week, index) => ({
            rankings: stage.sections[0].rankings,
            startTime: convertTimestampToFormattedDate(week.start),
            endTime: convertTimestampToFormattedDate(week.end),
            name: `Week ${index + 1}`,
            matches: week.matches
        }))
    };
}

const groupMatchesIntoWeeks = (matches) => {
    return matches.reduce((acc, match) => {
        matchTimestamp = new Date(match.startTime).getTime();

        const applicableWeek = acc.find((el) => 
            el.start - MATCH_CARDINALITY < matchTimestamp
                && el.end + MATCH_CARDINALITY > matchTimestamp
        );

        if (applicableWeek) {
            applicableWeek.matches.push(match);
            applicableWeek.start = applicableWeek.start > matchTimestamp ? matchTimestamp : applicableWeek.start;
            applicableWeek.end = applicableWeek.end < matchTimestamp ? matchTimestamp : applicableWeek.end;
            
            return acc;
        } else {
            acc.push({
                start: matchTimestamp,
                end: matchTimestamp,
                matches: [match]
            });

            return acc;
        }
    }, [])
        .sort((a, b) => {
            const aTimestamp = new Date(a.startTime).getTime();
            const bTimestamp = new Date(b.startTime).getTime();
    
            return aTimestamp - bTimestamp;
        });
}

const convertTimestampToFormattedDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.substr(-2);
    const day = `0${date.getDate()}`.substr(-2);
    const hour = `0${date.getHours() + 1}`.substr(-2);
    const minute = `0${date.getMinutes()}`.substr(-2);
    const second = `0${date.getSeconds()}`.substr(-2);

    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
};
