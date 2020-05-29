export interface Team {
    abbr: string,
    name: string,
    image: string
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
