import React from 'react'
import './Navbar.css'

const Navbar = () => {
    return(
        <header className="header">
            <a href="/home" className="logo">Logo</a>
            <nav className="navbar">
                <a href="/home">Home</a>
                <a href="/history">History</a>
                <a href="/">About Us</a>
                <a href="/">Services</a>
                <a href="/">Constact</a>
            </nav>
        </header>
    )

}

export default Navbar