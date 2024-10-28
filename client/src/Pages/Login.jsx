import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useUser } from '../UserContext';
import './index.css'; // Make sure this has styles for login-container, login-form, etc.

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userData = await signInWithEmailAndPassword(auth, email, password);
            setUser(userData.user);
            console.log("Login Success");
            navigate('/home');
        } catch (error) {
            console.log(error);
            setError('Failed to log in. Please check your credentials.');
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { firstName, lastName, birthdate, email });
            console.log("Account Created and User details saved to Firestore");
            navigate('/home');
        } catch (error) {
            if (error.code === 'auth/weak-password') {
                setError('Password must be at least 6 characters long.');
            } else if (error.code === 'auth/email-already-in-use') {
                setError('Email already in use. Redirecting to login.');
                setIsLogin(true);
            } else {
                setError('An error occurred during sign up. Please try again.');
            }
            console.log(error);
        }
    };

    return (
        <div className="login-container">
            <a href="/login" className="logo"></a>
            <div className="auth-section">
                <div className="form-container">
                    {isLogin ? (
                        <form className="login-form" onSubmit={handleLogin}>
                            <h2>Login to Your Account</h2>
                            {error && <p className="error-message">{error}</p>}
                            <label>Email:</label>
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <label>Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button type="submit">Sign In</button>
                            <p>New here? <span onClick={() => setIsLogin(false)}>Sign Up</span></p>
                        </form>
                    ) : (
                        <form className="signup-form" onSubmit={handleSignUp}>
                            <h2>Sign Up</h2>
                            {error && <p className="error-message">{error}</p>}
                            <label>First Name:</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            <label>Last Name:</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            <label>Birthdate:</label>
                            <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
                            <label>Email:</label>
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <label>Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button type="submit">Sign Up</button>
                            <p>Already registered? <span onClick={() => setIsLogin(true)}>Log In</span></p>
                        </form>
                    )}
                </div>
                <div className="info-section">
                    {isLogin ? (
                        <>
                            <h3>New Here?</h3>
                            <p>Sign up and discover a great amount of new opportunities!</p>
                            <button onClick={() => setIsLogin(false)}>Sign Up</button>
                        </>
                    ) : (
                        <>
                            <h3>Welcome Back!</h3>
                            <p>Login to access your account and continue where you left off.</p>
                            <button onClick={() => setIsLogin(true)}>Login</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
