// config/firebase.jsx
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyArFn5h3UMO8PcWBPM2Ve1tXUXEc3UsYpM",
  authDomain: "reactfirebase-dd3a0.firebaseapp.com",
  projectId: "reactfirebase-dd3a0",
  storageBucket: "reactfirebase-dd3a0.firebasestorage.app",
  messagingSenderId: "784948701391",
  appId: "1:784948701391:web:4179b765719716d68a2fba"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);
export const dataBase=getFirestore(app);
export const storage = getStorage(app);
