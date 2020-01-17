const admin = require('firebase-admin');
let serviceAccount = require('./firestore-config/firestore-config.json');

class Database {
    constructor () {
        this.db = null;
        this._connect();
    }

    _connect () {
        console.log('Connecting to firestore...');
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        
        this.db = admin.firestore();
    }

    async retrieveOne (key, value, table) {
        let snapshot;
        try {
            snapshot = await this.db.collection(table).where(key, '==', value).get();
        } catch (error) {
            return error;
        }

        // snapshot has id and data
        const data = [];
        snapshot.forEach(doc => {
            const item = doc.data();
            item.id = doc.id;
            data.push(item);
        });

        return data[0];
    }
}

module.exports = new Database();
