import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBDzl_sRnaAkEPRfWXFlITb4ECMFLVNF-Y",
    authDomain: "devexpo-c7822.firebaseapp.com",
    projectId: "devexpo-c7822",
    storageBucket: "devexpo-c7822.appspot.com",
    messagingSenderId: "199597600352",
    appId: "1:199597600352:web:ce5db682e57ca43ae15d05"
});


const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };