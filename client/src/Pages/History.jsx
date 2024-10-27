import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import './index.css';
import { db } from '../firebase';

const HistoryPage = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [productCollections, setProductCollections] = useState([]);
  const [sortOption, setSortOption] = useState('');

  const fetchMetadata = async () => {
    try {
      const metadataRef = collection(db, 'metadata');
      const snapshot = await getDocs(metadataRef);

      if (snapshot.empty) {
        console.log("No documents found in metadata collection.");
        return; 
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
      console.log(`Fetched products from ${productName}:`, products);
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
    setSortOption(''); // Reset sort option when loading a new collection
  };

  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);
  };

  const convertPriceToNumber = (price) => {
    return parseFloat(price.replace(/[$,]/g, '')); // Remove dollar sign and comma, then convert to number
  };

  const sortProducts = (products, option) => {
    let sortedProducts = [...products];

    if (option === 'priceLowToHigh') {
      sortedProducts.sort((a, b) => convertPriceToNumber(a.price) - convertPriceToNumber(b.price));
    } else if (option === 'priceHighToLow') {
      sortedProducts.sort((a, b) => convertPriceToNumber(b.price) - convertPriceToNumber(a.price));
    } else if (option === 'aToZ') {
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (option === 'zToA') {
      sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
    }

    return sortedProducts;
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    const sortedProducts = sortProducts(productCollections, sortOption);
    setProductCollections(sortedProducts);
  }, [sortOption, productCollections.length]); // Only depend on the length of productCollections

  return (
    <div className='history-container'>
      <h2>Available Collections</h2>
      <ul className='collection-buttons'>
        {collections.map((collectionName) => (
          <button onClick={() => handleCollectionClick(collectionName)} key={collectionName}>
            {collectionName}
          </button>
        ))}
      </ul>

      {selectedCollection && (
        <>
          <h2>Products for {selectedCollection}</h2>
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sortOption} onChange={handleSortChange}>
            <option value="">Select</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="aToZ">Title: A to Z</option>
            <option value="zToA">Title: Z to A</option>
          </select>

          {productCollections.length > 0 ? (
            <table className='display_products'>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {productCollections.map((product) => (
                  <tr key={product.id}>
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
