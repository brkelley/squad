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

export interface Player {
    id: string;
    summonerName: string;
    firstName: string;
    lastName: string;
    image: string;
    role: string;
}

export interface ScheduleMatchMetadata {
    startTime: string,
    blockName: string,
    league: {
        name: string
    },
    match: ScheduleMatch,
    state: string
}

export interface ScheduleMatch {
    id: string,
    type: string,
    teams: ScheduleTeam[],
    strategy: {
        type: string,
        count: number
    }
}

export interface ScheduleTeam {
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
