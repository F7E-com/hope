// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAInviShyIYmFRuifWhgHLBb78hi95uN_Q",
  authDomain: "f7e-database.firebaseapp.com",
  projectId: "f7e-database",
  storageBucket: "f7e-database.firebasestorage.app",
  messagingSenderId: "642686760461",
  appId: "1:642686760461:web:2549e76e002e3091340744",
  measurementId: "G-SVZZGFVLP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
