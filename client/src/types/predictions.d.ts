export interface Team {
    abbr: string,
    name: string,
    logo: string
}

export interface SplitStats {
    blindspot: Team,
    finalScore: Number,
    placement: Number,
    mostPredicted: Team,
    mostWon: Team
}

export interface UserSplitAchievement {
    splitName: string,
    splitStats: SplitStats
}
