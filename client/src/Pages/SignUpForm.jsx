import React, { useState } from "react";
import './index.css'
import { Link, useNavigate } from 'react-router-dom';
import {auth} from '../firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate(); 
    const [error, setError] = useState(''); // Add error state


    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await createUserWithEmailAndPassword(auth, email, password)
            console.log(email)
            console.log("Account Created")
            navigate('/login');

        } catch(error){
            if (error.code === 'auth/email-already-in-use') {
                console.log("Email already in use. Redirecting to login.");
                navigate('/login'); 
            } else {
                if (error.code === 'auth/weak-password') {
                    setError('Password must be at least 6 characters long.'); // Set specific error message
                } else {
                    setError('An error occurred during sign up. Please try again.'); // Handle other errors
                }
            }
        }
    }
    return(
        <div className= "signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
                <label htmlFor="email">
                    Email:
                    <input type="text" onChange={(e) => setEmail(e.target.value)}/>
                </label>
                <label htmlFor="password">
                    Password:
                    <input type="password"  onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <button type = 'submit'> Sign Up </button> <br />
                <p> Already Registered? <Link to = '/login'> Login </Link></p>
            </form>
        </div>
    )
}

export default SignUpForm