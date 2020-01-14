const buildTables = async sqlite => {
    await sqlite.run(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY NOT NULL UNIQUE,
            first_name TEXT,
            last_name TEXT,
            summoner_id TEXT,
            email TEXT,
            hash TEXT,
            salt TEXT,
            role INTEGER NOT NULL,
            summoner_name TEXT NOT NULL UNIQUE
        )
    `);

    await sqlite.run(`
    CREATE TABLE IF NOT EXISTS predictions (
        id TEXT PRIMARY KEY NOT NULL UNIQUE,
        user_id TEXT NOT NULL,
        match_id TEXT NOT NULL UNIQUE,
        prediction TEXT NOT NULL,
        league_id TEXT NOT NULL
    )
`);
};

module.exports = buildTables;
