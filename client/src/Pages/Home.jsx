import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore'; 
import { auth } from '../firebase'; // Import auth
import './index.css';

const HomePage = () => {
  const [column, setColumns] = useState([]);
  const [records, setRecords] = useState([]);
  const [product, setProduct] = useState([]);
  const [pages, setPages] = useState([]);
  const [collections, setCollections] = useState([]);
  const [userName, setUserName] = useState(''); // State to hold the user's name

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

  const saveDataToFirestore = async (products, productName) => {
    // ... existing saveDataToFirestore logic
  };

  const lookupProduct = async (e) => {
    // ... existing lookupProduct logic
  };

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
    </div>
  );
};

export default HomePage;
