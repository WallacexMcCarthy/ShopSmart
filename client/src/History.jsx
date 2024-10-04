// src/HistoryPage.jsx

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; 

const HistoryPage = () => {
  const [collections, setCollections] = useState(['microwave']);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [productCollections, setProductCollections] = useState([]);

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

  return (
    <div className='history-container'>
      <h2>Available Collections</h2>
      <ul>
        {collections.map((collectionName) => (
          <li key={collectionName} onClick={() => handleCollectionClick(collectionName)}>
            {collectionName}
          </li>
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
