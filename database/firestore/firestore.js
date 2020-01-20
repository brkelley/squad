const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');

class Database {
    constructor () {
        this.db = null;
        this._connect();
    }

    _connect () {
        // Initialize Cloud Firestore through Firebase
        
        
        console.log('connecting to firebase...');
        this.db = firebase.firestore();
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
            const collection = this.db.collection(table);
            if (filters && filters.length > 0) {
                filters.forEach(filter => {
                    collection.where(filter.key, '==', filter.value);
                });
            }
            snapshot = await collection.get();
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
            updateDoc.update(fieldsAsObject);
        } catch (error) {
            console.log(error);
            return error;
        }

        return updateDoc;
    }
}

module.exports = new Database();
