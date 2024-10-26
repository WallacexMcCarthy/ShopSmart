import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use Link for navigation
import './Navbar.css';
import { useUser } from '../UserContext'; // Import your UserContext

const Navbar = () => {
    const { setUser } = useUser(); // Access setUser from context
    const navigate = useNavigate(); // Initialize navigate hook

    const handleLogout = () => {
        setUser(null); // Clear user state
        navigate('/login'); // Redirect to login page
    };

    return (
        <header className="header">
            <a href="/home" className="logo"></a>
            <nav className="navbar">
                <Link to="/home">Home</Link>
                <Link to="/history">History</Link>
                <Link to="/">About Us</Link>
                <Link to="/">Services</Link>
                <Link to="/">Contact</Link>
                <button onClick={handleLogout} className="logout-button">Logout</button> {/* Logout button */}
            </nav>
        </header>
    );
};

export default Navbar;
