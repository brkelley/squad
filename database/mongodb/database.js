const mongoose = require('mongoose');

const host = '127.0.0.1';
const port = 27017;
const databaseName = 'squad';

class Database {
    constructor () {
        this._connect();
    }

    _connect () {
        mongoose.connect(`mongodb://${host}:${port}/${databaseName}`, { useNewUrlParser: true })
            .then(() => {
                console.log(`Connected to ${databaseName} on ${host}:${port}`);
            })
            .catch(err => {
                // TODO add special message if mongo isn't running
                console.log('Database connection error: ', err);
            });
    }
}

module.exports = new Database();
