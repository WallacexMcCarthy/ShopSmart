import React, { useState } from "react";
import './index.css'
import { Link } from 'react-router-dom'
import {auth} from '../firebase'
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from '../UserContext';

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { setUser } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const userData = await signInWithEmailAndPassword(auth, email, password)
            setUser(userData.user)
            console.log("Login Success")
            console.log(userData)
            navigate('/home')
        } catch(error){
            console.log(error)
        }
    }
    return(
        <div className= "login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <label htmlFor="email">
                    Email:
                    <input type="text" onChange={(e) => setEmail(e.target.value)}/>
                </label>
                <label htmlFor="password">
                    Password:
                    <input type="password"  onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <button type = 'submit'> Login </button> <br />
                <p> Don't have an account? <Link to = '/signup'> Sign Up </Link></p>
            </form>
        </div>
    )
}

export default LoginForm