import firebase from 'firebase';

export const validateFirebaseUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                unsubscribe();
                resolve(user);
            }
        }, reject);
    });
};
