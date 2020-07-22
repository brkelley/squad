export interface MatchMetadata {
    startTime: string
    state: string
    type: string
    blockName: string
    league: MatchLeague
    match: Match
    tournamentMetadata: TournamentMetadata
}

interface Match {
    id: string
    flags: string[]
    strategy: MatchStrategy
    teams: Team[]
}

interface MatchStrategy {
    type: string
    count: number
}

interface MatchLeague {
    name: string
    slug: string
}

interface Team {
    code: string
    image: string
    name: string
    record?: TeamRecord
    // This might only be relevant for teams inside match info
    result?: TeamMatchResult
    // Main team endpoint
    id?: string
    slug?: string
    alternativeImage?: string
    homeLeague?: {
        name: string
        region: string
    },
    players?: []
}

interface TeamRecord {
    wins: number
    losses: number
}

interface TeamMatchResult {
    outcome: string
    gameWins: number
}

interface TournamentMetadata {
    tournament: Tournament
    stage: Stage
    section: Section
}

interface Tournament {
    id: string
    slug: string
    startDate: string
    endDate: string
}

interface Stage {
    name: string
    type: string
    slug: string
}

interface Section {
    name: string
}
