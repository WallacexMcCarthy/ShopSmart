import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore'; 
import { auth } from '../firebase'; // Import auth
import './index.css';

const HomePage = () => {
  const [column, setColumns] = useState([]);
  const [records, setRecords] = useState([]);
  const [product, setProduct] = useState('');
  const [pages, setPages] = useState('');
  const [collections, setCollections] = useState([]);
  const [userName, setUserName] = useState(''); // State to hold the user's name
  const [loading, setLoading] = useState(false); // Set initial loading state to false

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get the current logged-in user
      if (user) {
        const userRef = doc(db, 'users', user.uid); // Reference to user's Firestore document
        const userDoc = await getDoc(userRef); // Fetch user data
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`); // Set the user's full name
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, []);

  const fetchMetadata = async () => {
    try {
      const metadataRef = collection(db, 'metadata');
      const snapshot = await getDocs(metadataRef);

      if (snapshot.empty) {
        console.log("No documents found in metadata collection.");
        return []; 
      }

      const metadataNames = snapshot.docs.map(doc => doc.data().productName);
      console.log("Fetched product names:", metadataNames); 
      setCollections(metadataNames); 
    } catch (error) {
      console.error("Error fetching metadata from Firestore: ", error);
    }
  };

  const clearCollection = async (collectionName) => {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`Cleared collection: ${collectionName}`);
  };

  const saveDataToFirestore = async (products, productName) => {
    try {
      // Clear existing documents in the product-specific collection
      await clearCollection(productName);

      // Save products to the product-specific collection
      const collectionRef = collection(db, productName);
      for (const product of products) {
        await addDoc(collectionRef, product);  
      }
      console.log("Products successfully saved to Firestore under collection:", productName);
    
      // Check if product name already exists in the metadata collection
      const metadataRef = collection(db, 'metadata');
      const snapshot = await getDocs(metadataRef);
      const existingNames = snapshot.docs.map(doc => doc.data().productName);
      
      // Only add the product name if it does not exist
      if (!existingNames.includes(productName)) {
        // Attempt to add product name to metadata
        await addDoc(metadataRef, { productName });
        console.log("Product name successfully saved to metadata collection.");
      } else {
        console.log("Product name already exists in metadata collection. Skipping save.");
      }
    } catch (error) {
      console.error("Error saving products or metadata to Firestore: ", error);
    }
  };

  const lookupProduct = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the search starts
    try {
      console.log('Fetching from /ebay');

      const res = await fetch('/ebay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, pages }),
      });
      const data = await res.json();

      const productKey = Object.keys(data)[0]; 
      const products = data[productKey]; 

      if (Array.isArray(products) && products.length > 0) {
        setColumns(Object.keys(products[0]));  
        setRecords(products);  
        await saveDataToFirestore(products, product);  
      } else {
        console.log('No products found or invalid data format.');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false); // Set loading to false after operations complete
    }
  };

  // Conditional rendering: Show loading message only when searching
  return (
    <div className='home-container'>
      <h1>Welcome, {userName || 'User'}!</h1> {/* Display user's name */}
      <form className='lookup-product' onSubmit={lookupProduct}>
        <h2> Product Lookup </h2>
        <label htmlFor='product'>
          Lookup Product:
          <input type="text" onChange={(e) => setProduct(e.target.value)} />
        </label>
        <label htmlFor='pages'>
          Number of Pages to look through:
          <input type="text" onChange={(e) => setPages(e.target.value)} />
        </label>
        <button type='submit'> Lookup </button>
      </form>

      {loading ? (
        <div>Loading... Please wait.</div> // Show loading message when searching
      ) : (
        <table className='display_products'>
          <thead>
            <tr>
              {column.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, i) => (
              <tr key={i}>
                <td>{record.id}</td>
                <td>{record.title}</td>
                <td>{record.price}</td>
                <td>
                  <a href={record.link} target="_blank" rel="noopener noreferrer">Link</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HomePage;
