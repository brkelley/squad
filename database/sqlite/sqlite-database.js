const Sqlite = require('sqlite-async');
const path = require('path');
const buildTables = require('./table-builder.js');
const { convertObjectToKeyValues } = require('./util/sqlite.util.js');
const snakeCase = require('lodash/snakeCase');
 
class Database {
    constructor () {
        this.db = null;
        console.log('constructor of sqlite');
        this._connect();
    }

    async _connect () {
        const dbPath = path.resolve(__dirname, 'db/squad.db');
        try {
            this.db = await Sqlite.open(dbPath);
            buildTables(this.db);
        } catch (error) {
            throw Error(error);
        }
        console.log('Connected to the in-memory SQlite database.');
    }

    close () {
        // close the database connection
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }

    async insert (data, table) {
        const keyValueArrays = data.map(el => convertObjectToKeyValues(el, table));
        const keys = keyValueArrays[0].map(el => el.key);
        const values = keyValueArrays[0].map(el => el.value);
        try {
            await this.db.run(
                `
                    INSERT INTO ${table}(${keys.join(', ')})
                    VALUES(${values.map(() => '?').join(', ')})
                `,
                values
            );
            return data;
        } catch (error) {
            throw new Error('DATABASE ERROR: Could not insert into database');
        }
    }

    async retrieveOne (key, value, table) {
        try {
            const sqlString = `SELECT * FROM ${table} WHERE ${snakeCase(key)} = ?`;
            return await this.db.get(sqlString, value);
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async retrieveAll (table) {
        try {
            const sqlString = `SELECT * FROM ${table}`;
            return await this.db.all(sqlString);
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new Database();
