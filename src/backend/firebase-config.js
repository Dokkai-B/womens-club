// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBw5K1dPmUc7rrS4TX5WxT49OJCHi5hAUc",
    authDomain: "womensclub-a0094.firebaseapp.com",
    projectId: "womensclub-a0094",
    storageBucket: "womensclub-a0094.appspot.com",
    messagingSenderId: "84984560777",
    appId: "1:84984560777:web:507f05646d5f3f8decda58",
    measurementId: "G-MYES348C59"

};

export const app = initializeApp(firebaseConfig);
export const FIREBASE_APP = initializeApp(firebaseConfig);  
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const database = getFirestore(app);