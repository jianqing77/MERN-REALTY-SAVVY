// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: 'realty-savvy-mern.firebaseapp.com',
    projectId: 'realty-savvy-mern',
    storageBucket: 'realty-savvy-mern.appspot.com',
    messagingSenderId: '1045400381455',
    appId: '1:1045400381455:web:2d30c0d990b978004e9b7a',
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
console.log(FirebaseApp);

export default FirebaseApp;
