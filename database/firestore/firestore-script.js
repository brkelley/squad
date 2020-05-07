const firebase = require('firebase-admin');
const dotenv = require('dotenv');
require('firebase/firestore');
const lodash = require('lodash');
const fs = require('fs');

const envs = dotenv.config({ path: '../../config.env' }).parsed;
const buff = Buffer.from(envs.FIREBASE_CONFIG_SERVICE_ACCOUNT, 'base64');
const text = buff.toString('ascii');

firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(text)),
    databaseURL: 'https://squad-265800.firebaseio.com'
});

const db = firebase.firestore();

const predictions = [];

db.collection('predictions').get().then(snapshot => {
    snapshot.forEach(doc => {
        predictions.push(doc.data());
    });

    try {
        fs.writeFileSync('./old-data/spring-2020-predictions.json', JSON.stringify(predictions));
    } catch (err) {
        console.error(err);
    }
});
