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
};

module.exports = buildTables;
