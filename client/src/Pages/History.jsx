// src/HistoryPage.jsx

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import './index.css'
import { db, coll } from '../firebase'; 

const HistoryPage = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [productCollections, setProductCollections] = useState([]);

  
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

  const fetchProductsFromFirestore = async (productName) => {
    try {
      const collectionRef = collection(db, productName);
      const snapshot = await getDocs(collectionRef);
      
      if (snapshot.empty) {
        console.log(`No documents found in collection: ${productName}`);
        return []; // Return an empty array if no documents are found
      }
      
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`Fetched products from ${productName}:`, products); // Log fetched products
      return products;
    } catch (error) {
      console.error("Error fetching products from Firestore: ", error);
      return [];
    }
  };

  const handleCollectionClick = async (collectionName) => {
    setSelectedCollection(collectionName);
    const products = await fetchProductsFromFirestore(collectionName);
    setProductCollections(products);
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  return (
    <div className='history-container'>
      <h2>Available Collections</h2>
      <ul className='collection-buttons'>
        {collections.map((collectionName) => (
          <button onClick={() => handleCollectionClick(collectionName)}>
            {collectionName}
          </button>
        ))}
      </ul>

      {selectedCollection && (
        <>
          <h2>Products for {selectedCollection}</h2>
          {productCollections.length > 0 ? (
            <table className='display_products'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {productCollections.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.title}</td>
                    <td>{product.price}</td>
                    <td>
                      <a href={product.link} target="_blank" rel="noopener noreferrer">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No products found in this collection.</p>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;
