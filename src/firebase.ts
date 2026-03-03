import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDtf-msPFyb9eMr-f2_TRhiz10VzdzltHg",
    authDomain: "mine-f25ab.firebaseapp.com",
    databaseURL: "https://mine-f25ab-default-rtdb.firebaseio.com",
    projectId: "mine-f25ab",
    storageBucket: "mine-f25ab.firebasestorage.app",
    messagingSenderId: "907030562223",
    appId: "1:907030562223:web:ea392bbf211b0773911b5a",
    measurementId: "G-D4YJ65E1LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Exports for the app
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
