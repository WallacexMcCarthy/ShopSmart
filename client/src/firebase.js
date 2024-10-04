// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMrBhAM-jADRulDIjyaxLJuWS7aPsxMM0",
  authDomain: "shopsmart-e59bf.firebaseapp.com",
  projectId: "shopsmart-e59bf",
  storageBucket: "shopsmart-e59bf.appspot.com",
  messagingSenderId: "389443815763",
  appId: "1:389443815763:web:7ce0e1cdaa19ab7de079a6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);  // Initialize Firestore

// Export authentication and Firestore instances
export { auth, db };