// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";  // Import Firestore and related functions

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

// Function to fetch collection names from the "metadata/collections" document
const fetchCollectionNames = async () => {
  try {
    const docRef = doc(db, 'metadata', 'collections'); // Reference to the metadata document
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const collectionNames = data.collectionNames || [];  // Fetch the collection names
      console.log("Collection names:", collectionNames);
      return collectionNames;
    } else {
      console.log("No metadata document found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching collection names: ", error);
    return [];
  }
};

// Fetch collection names and store them in a constant
const coll = await fetchCollectionNames(); // Wait for the names to be fetched
console.log("Fetched collections:", coll);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Successfully set persistence
  })
  .catch((error) => {
    console.error("Error setting persistence: ", error);
  });

// Export authentication and Firestore instances
export { auth, db, coll};
