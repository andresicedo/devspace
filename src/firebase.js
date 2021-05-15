import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDhgGJX-IX4W0RfqJqgzdM5_DwryFQ5tRc",
    authDomain: "devspace-6e219.firebaseapp.com",
    projectId: "devspace-6e219",
    storageBucket: "devspace-6e219.appspot.com",
    messagingSenderId: "909577527050",
    appId: "1:909577527050:web:98e7bfbe20059b4c34a4f3"
});


const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };