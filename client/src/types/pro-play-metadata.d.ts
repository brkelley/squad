export interface TeamMetadata {
    id: string;
    slug: string;
    name: string;
    code: string;
    image: string;
    alternativeImage: string;
    backgroundImage: string;
    homeLeague: {
        name: string;
        region: string;
    };
    players: Player[];
}

export interface AbbreviatedTeamMetadata {
    code: string;
    image: string;
    name: string;
}

export interface Player {
    id: string;
    summonerName: string;
    firstName: string;
    lastName: string;
    image: string;
    role: string;
}

export interface TournamentSchedule {
    leagueId: string;
    leagueName: string;
    schedule: ScheduleStage[]
}

export interface ScheduleStage {
    name: string;
    type: string;
    slug: string;
    sections: ScheduleSection[];
    startTime: string;
    endTime: string
}

export interface ScheduleSection {
    name: string;
    id: string;
    matches: ScheduleMatch[];
    rankings: ScheduleRanking[];
    startTime: string;
    endTime: string;
}

export interface ScheduleMatch {
    startTime: string;
    blockName: string;
    league: {
        name: string
    },
    state: string,
    id: string,
    type: string,
    teams: ScheduleTeam[],
    strategy: {
        type: string,
        count: number
    },
    previousMatchIds: string[]
}

export interface ScheduleRanking {
    ordinal: number;
    teams: ScheduleTeam[];
}

export interface ScheduleTeam {
    id: string;
    slug: string;
    name: string,
    code: string,
    image: string,
    result: {
        outcome: string,
        gameWins: number
    },
    record: {
        wins: number,
        losses: number
    }
}
