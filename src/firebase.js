// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgYLh0jk5xlEvVWX595V8_rU3wCaYsJy4",
  authDomain: "budgetmaster12345.firebaseapp.com",
  projectId: "budgetmaster12345",
  storageBucket: "budgetmaster12345.firebasestorage.app",
  messagingSenderId: "909408761696",
  appId: "1:909408761696:web:032dcb60ec67f644239005",
  measurementId: "G-FFRTNPL2HD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 