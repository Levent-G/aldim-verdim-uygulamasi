// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBNKdQeNhJHoKfxGQXGJkBFOYSKOiaCHA",
  authDomain: "aldim-verdim.firebaseapp.com",
  projectId: "aldim-verdim",
  storageBucket: "aldim-verdim.firebasestorage.app",
  messagingSenderId: "893728584170",
  appId: "1:893728584170:web:edce38fa448e9a3ba98293",
  measurementId: "G-FVKLZ0D0S2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
