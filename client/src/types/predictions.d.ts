// import { Team } from './pro-play-metadata';

export interface PredictionFilter {
    leagueSlug: string
    tournamentId: string
    stageSlug: string
    sectionName: string
}

export interface Team {
    abbr: string,
    name: string,
    image: string
}

export interface User {
    email: string
    firstName: string
    lastName: string
    hash: string
    preferences: {
        favoriteTeam: Team
    }
    role: Number
    salt: string
    splitStats: {
        [splitId: string]: SplitStats
    }
    summonerId: string
    summonerName: string
}

export interface SplitStats {
    blindspot: Team,
    finalScore: number,
    placement: number,
    mostPredicted: Team,
    mostWon: Team,
    score: number,
    mostGuessedSeriesScore: string
}

export interface UserSplitAchievement {
    splitName: string,
    splitStats: SplitStats
}

export interface LeaderboardEntry {
    id: string,
    name: string,
    score: number
}

export interface Prediction {
    id?: string
    matchId: string
    prediction: string
    timestamp: Number
    userId: string
}
