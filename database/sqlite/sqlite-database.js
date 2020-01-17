// const Sqlite = require('sqlite-async');
// const path = require('path');
// const buildTables = require('./table-builder.js');
// const { convertObjectToKeyValues } = require('./util/sqlite.util.js');
// const snakeCase = require('lodash/snakeCase');
 
// class Database {
//     constructor () {
//         this.db = null;
//         console.log('constructor of sqlite');
//         this._connect();
//     }

//     async _connect () {
//         const dbPath = path.resolve(__dirname, 'db/squad.db');
//         try {
//             this.db = await Sqlite.open(dbPath);
//             buildTables(this.db);
//         } catch (error) {
//             throw Error(error);
//         }
//         console.log('Connected to the in-memory SQlite database.');
//     }

//     close () {
//         // close the database connection
//         db.close((err) => {
//             if (err) {
//                 return console.error(err.message);
//             }
//             console.log('Close the database connection.');
//         });
//     }

//     async insert (data, table) {
//         const keyValueArrays = data.map(el => convertObjectToKeyValues(el, table));
//         const keys = keyValueArrays[0].map(el => el.key);
//         const values = keyValueArrays[0].map(el => el.value);
//         const sqlString = `
//             INSERT INTO ${table}(${keys.join(', ')})
//             VALUES(${values.map(() => '?').join(', ')})
//         `;
//         console.log('Inserting into DB: ', sqlString);
//         console.log('Values: ', values);
//         try {
//             await this.db.run(sqlString, values);
//             return data;
//         } catch (error) {
//             console.log('logging database error');
//             console.log(error);
//             throw new Error('DATABASE ERROR: Could not insert into database');
//         }
//     }

//     /**
//      * fields:      [{ key: id, value: '123' }, { key: name, value: 'Name' }]
//      * comparator:  { key: name, value: 'Name' }
//      */
//     async update (fields, comparator, table) {
//         const updateString = fields.reduce((str, field) => {
//             return str ? `${str},${field.key}=?` : `${field.key}=?`;
//         }, '');
//         const data = fields.map(field => field.value);
//         data.push(comparator.value);
//         try {
//             await this.db.run(
//                 `
//                     UPDATE ${table}
//                     SET ${updateString}
//                     WHERE ${comparator.key}=?
//                 `,
//                 data
//             );
//         } catch (error) {
//             throw new Error('DATABASE ERROR: Could not update database row');
//         }
//     }

//     async retrieveOne (key, value, table) {
//         try {
//             const sqlString = `SELECT * FROM ${table} WHERE ${snakeCase(key)} = ?`;
//             return await this.db.get(sqlString, value);
//         } catch (err) {
//             console.log(err);
//             return err;
//         }
//     }

//     async retrieveAll (table, filters) {
//         let sqlString = `SELECT * FROM ${table}`;
//         let params = [];
//         if (filters && filters.length > 0) {
//             sqlString = filters.reduce((aggString, filter, index) => {
//                 aggString += index === 0 ? ` WHERE ${filter.key}=?` : ` AND ${filter.key}=?`;
//                 return aggString;
//             }, sqlString);

//             params = filters.map(el => el.value);
//         }
//         try {
//             return await this.db.all(sqlString, params);
//         } catch (err) {
//             throw new Error(err);
//         }
//     }
// }

// module.exports = new Database();
