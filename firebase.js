// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBz65Xgr5hKxPIRO-fANtDfOy1rsqIxrT4",
    authDomain: "inventory-management-633e5.firebaseapp.com",
    projectId: "inventory-management-633e5",
    storageBucket: "inventory-management-633e5.appspot.com",
    messagingSenderId: "449637326575",
    appId: "1:449637326575:web:1c62982177039ffe7b851a",
    measurementId: "G-7LE1WM4NLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }