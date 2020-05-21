const dotenv = require('dotenv');
const firebase = require('firebase-admin');
// Required for side-effects
require('firebase/firestore');

class Database {
    constructor () {
        this.db = null;
        this._connect();
    }

    _connect () {
        const envs = dotenv.config({ path: './config.env' }).parsed;

        let buff = Buffer.from(envs.FIREBASE_CONFIG_SERVICE_ACCOUNT, 'base64');
        let text = buff.toString('ascii');
        // Initialize Cloud Firestore through Firebase
        firebase.initializeApp({
            credential: firebase.credential.cert(JSON.parse(text)),
            databaseURL: 'https://squad-265800.firebaseio.com'
        });
        
        console.log('connecting to firebase...');
        this.db = firebase.firestore();
    }

    generateJWT (uid, data) {
        return firebase.auth().createCustomToken(uid, data);
    }

    async translateJWT (token) {
        return await firebase.auth().verifyIdToken(token);
    }

    async retrieveOne (key, value, table) {
        let doc;
        try {
            // need difference for id vs other field
            if (key === 'id') {
                doc = await this.db.collection(table).doc(value).get();
            } else {
                const snapshot = await this.db.collection(table).where(key, '==', value).get();
                snapshot.forEach(el => {
                    doc = el;
                    return doc;
                });
            }
        } catch (error) {
            console.log(error);
            return error;
        }

        return { id: doc.id, ...doc.data() };
    }

    async retrieveAll (table, filters) {
        let snapshot;
        try {
            let collection = this.db.collection(table);
            if (filters && filters.length > 0) {
                filters.forEach(filter => {
                    collection = collection.where(filter.key, '==', filter.value);
                });
            }
            snapshot = await collection.get();
        } catch (error) {
            console.log(error);
            return error;
        }

        // snapshot has id and data
        const data = [];
        snapshot.forEach((doc) => {
            const item = doc.data();
            item.id = doc.id;
            data.push(item);
        });

        return data;
    }

    async insert (doc, table) {
        let finishedDoc;
        try {
            const setDoc = await this.db.collection(table).add(doc);
            finishedDoc = { id: setDoc.id, ...doc };
        } catch (error) {
            console.log('error in insert: ', error);
            return error;
        }

        return finishedDoc;
    }

    async update (fields, comparator, table) {
        // firestore always compares on ID
        if (comparator.key !== 'id') {
            console.log('Updating with firestore requires ID!');
            return null;
        }

        const fieldsAsObject = fields.reduce((obj, field) => {
            obj[field.key] = field.value;
            return obj;
        }, {});

        let updateDoc;
        try {
            updateDoc = await this.db.collection(table).doc(comparator.value);
            await updateDoc.update(fieldsAsObject);
        } catch (error) {
            console.log(error);
            return error;
        }

        return updateDoc;
    }
}

module.exports = new Database();
