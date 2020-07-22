import { Team } from './pro-play-metadata';

export interface User {
    id: string;
    discordId: string;
    discordName: string;
    email: string;
    firstName: string;
    lastName: string;
    summonerId: string;
    summonerName: string;
    preferences: {
        favoriteTeam: Team | null
    };
    userFlags: string[]
}

export interface SplitStat {
    blindspot: Team;
    mostPredicted: Team;
    mostWon: Team;
    placement: number;
    score: number;
    mostGuessedSeriesScore: string;
}
