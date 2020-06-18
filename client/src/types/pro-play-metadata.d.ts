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
