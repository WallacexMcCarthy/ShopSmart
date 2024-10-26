import React, { useState } from "react";
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Ensure Firestore is imported
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore"; // Import Firestore methods

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log(email);
            console.log("Account Created");

            // Get the user object
            const user = userCredential.user;

            // Create a document reference in Firestore for the user
            const userRef = doc(db, 'users', user.uid); // Using UID as document ID
            
            // Save additional user details to Firestore
            await setDoc(userRef, {
                firstName,
                lastName,
                birthdate,
                email
            });

            console.log("User details saved to Firestore");

            // Redirect to login page
            navigate('/login');

        } catch (error) {
            if (error.code === 'auth/weak-password') {
                setError('Password must be at least 6 characters long.');
            } else if (error.code === 'auth/email-already-in-use') {
                setError('Email already in use. Redirecting to login.');
                navigate('/login');
            } else {
                setError('An error occurred during sign up. Please try again.');
            }
            console.log(error);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>}

                <label htmlFor="firstName">
                    First Name:
                    <input type="text" onChange={(e) => setFirstName(e.target.value)} required />
                </label>

                <label htmlFor="lastName">
                    Last Name:
                    <input type="text" onChange={(e) => setLastName(e.target.value)} required />
                </label>

                <label htmlFor="birthdate">
                    Birthdate:
                    <input type="date" onChange={(e) => setBirthdate(e.target.value)} required />
                </label>

                <label htmlFor="email">
                    Email:
                    <input type="text" onChange={(e) => setEmail(e.target.value)} required />
                </label>

                <label htmlFor="password">
                    Password:
                    <input type="password" onChange={(e) => setPassword(e.target.value)} required />
                </label>

                <button type='submit'> Sign Up </button> <br />
                <p> Already Registered? <Link to='/login'> Login </Link></p>
            </form>
        </div>
    );
};

export default SignUpForm;
