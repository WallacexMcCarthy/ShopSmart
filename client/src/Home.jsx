import React, {useState, useEffect} from 'react'
import { db } from './firebase'; 
import { collection, addDoc, getDocs } from 'firebase/firestore'; 
import './index.css'



const HomePage = () => {
  const [column, setColumns] = useState([])
  const [records, setRecords] = useState([])
  const [product, setProduct] = useState([])
  const [pages,  setPages] = useState([])
  const [collections, setCollections] = useState([]);

  const saveDataToFirestore = async (products, productName) => {
    try {
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
      saveDataToFirestore(products, product);  
    } else {
      console.log('No products found or invalid data format.');
    }
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
};
  useEffect(() => {
    
  }, [])
    return(
        <div className='home-container'>
          <form className='lookup-product' onSubmit={lookupProduct}>
            <h2> Product Lookup </h2>
            <label htmlFor='product'>
              Lookup Product:
              <input type= "text" onChange={(e) => setProduct(e.target.value)} />
            </label>
            <label htmlFor='pages'>
              Number of Pages to look through:
              <input type= "text" onChange={(e) => setPages(e.target.value)} />
            </label>
            <button type = 'submit'> Lookup </button>
            </form> 
            <table className='display_products'>
        <thead>
          <tr>
            {column.map((c,i) => (
              <th key = {i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {
            records.map((record, i) =>(
              <tr key = {i}>
                <td>{record.id}</td>
                <td>{record.title}</td>
                <td>{record.price}</td>
                <td>
                  <a href={record.link} target=" blank" rel="noopener noreferrer">Link</a>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
         </div>
    )
}

export default HomePage