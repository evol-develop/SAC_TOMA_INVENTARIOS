import { getAuth } from 'firebase/auth';
import firebase from "firebase/compat";
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from "firebase/storage";
import { getFunctions } from 'firebase/functions';



const firebaseConfig = {
    apiKey: "AIzaSyBKKwHib44CAXt1UuRLzCXiOHYdj_B4M1o",
    authDomain: "evolsoft-construccion.firebaseapp.com",
    projectId: "evolsoft-construccion",
    storageBucket: "evolsoft-construccion.appspot.com",
    messagingSenderId: "960999736013",
    appId: "1:960999736013:web:9e32636f3197b0bf2e1f84"
};

// Initialize Firebase
export const FirebaseApp = firebase.initializeApp(firebaseConfig)
export const FirebaseAuth = getAuth(FirebaseApp)
export const FirebaseDB = getFirestore()
export const analytics = getAnalytics(FirebaseApp)
export const firebaseStorage = getStorage(FirebaseApp);

    

