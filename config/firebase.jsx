// config/firebase.jsx
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyA7hQVOlUAifbOr2T0eH92tYaBidK9tcsU",
  authDomain: "tvms-ad431.firebaseapp.com",
  projectId: "tvms-ad431",
  storageBucket: "tvms-ad431.firebasestorage.app",
  messagingSenderId: "254244045938",
  appId: "1:254244045938:web:a81894a16b53014ea8eeeb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);
export const dataBase=getFirestore(app);
export const storage = getStorage(app);
