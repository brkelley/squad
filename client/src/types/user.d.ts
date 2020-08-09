import { TeamMetadata, AbbreviatedTeamMetadata } from './pro-play-metadata';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    hash: string;
    salt: string;
    role: number;
    summonerId: string;
    summonerName: string;
    preferences: {
        favoriteTeam: TeamMetadata
    },
    splitStats: {
        [splitName: string]: SplitStat;
    },
    flags: {
        [flagName: string]: Boolean;
    }
}

export interface SplitStat {
    blindspot: AbbreviatedTeamMetadata;
    mostPredicted: AbbreviatedTeamMetadata;
    mostWon: AbbreviatedTeamMetadata;
    placement: number;
    score: number;
    mostGuessedSeriesScore: string;
}
