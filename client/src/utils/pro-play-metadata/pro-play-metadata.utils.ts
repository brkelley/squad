import { MatchMetadata, MatchLeague, Tournament, Stage, Section } from '../../types/pro-play-metadata';
import filter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';

export function getUniqueLeagues (matches: MatchMetadata[]): MatchLeague[] {
    return uniqBy(
        matches.map((match) => match.league),
        (matchLeague) => matchLeague.slug
    );
};

export function getUniqueTournaments ({
    matches,
    leagueSlug
}: { matches: MatchMetadata[], leagueSlug: string }): Tournament[] {
    const filteredMatches = matches.filter((match) => match.league.slug === leagueSlug);
    return uniqBy(
        filteredMatches.map((match) => match.tournamentMetadata.tournament), 
        (tournament) => tournament.id
    );
};

export function getUniqueStages ({
    matches,
    leagueSlug,
    tournamentId
}: { matches: MatchMetadata[], leagueSlug: string, tournamentId: string }): Stage[] {
    const filteredMatches = matches.filter(
        (match) => match.league.slug === leagueSlug
            && match.tournamentMetadata.tournament.id === tournamentId
    );

    return uniqBy(
        filteredMatches.map((match) => match.tournamentMetadata.stage),
        (stage) => stage.slug
    );
};

interface GetUniqueSectionsProps {
    matches: MatchMetadata[],
    leagueSlug: string,
    tournamentId: string,
    stageSlug: string,
    useBlockNameSwitch?: boolean
}
export function getUniqueSections ({
    matches,
    leagueSlug,
    tournamentId,
    stageSlug,
    useBlockNameSwitch, 
}: GetUniqueSectionsProps): Section[] {
    const filteredMatches = matches.filter(
        (match) => match.league.slug === leagueSlug
            && match.tournamentMetadata.tournament.id === tournamentId
            && match.tournamentMetadata.stage.slug === stageSlug
    );

    if (useBlockNameSwitch) {
        return uniqBy(
            filteredMatches.map((match) => ({ name: match.blockName })),
            (section) => section.name
        )
    }

    return uniqBy(
        filteredMatches.map((match) => match.tournamentMetadata.section),
        (section) => section.name
    );
};

export function getMatchesByFilters (matches: MatchMetadata[], filters: any): MatchMetadata[] {
    return filter(matches, filters) || null;
};

// This function returns the closest match to the current time
// If all matches have passed, then it returns the most recent one
export function findNearestMatch (matches: MatchMetadata[]): MatchMetadata {
    const currentTimestamp = new Date().getTime();
    let latestMatchTimestamp = 0;
    let latestMatch;

    for (let currentMatch of matches) {
        const matchStartTimestamp = new Date(currentMatch.startTime).getTime();

        if (currentTimestamp < matchStartTimestamp) {
            return currentMatch;
        }
        if (matchStartTimestamp > latestMatchTimestamp) {
            latestMatchTimestamp = matchStartTimestamp;
            latestMatch = currentMatch;
        }
    }

    return latestMatch;
}
