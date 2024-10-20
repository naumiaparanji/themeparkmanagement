// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import MainLogo from './images/flagslogo.png'; 

const Navbar = () => {
    // Common style for navbar links
    const linkStyle = {
        fontSize: '20px',
        fontWeight: 'bold',
        textDecoration: 'none',
        color: '#333',
        margin: '0 10px',
    };

    return (
        <div className="navbar">
            <section className="navbar-links" id="navbar-logo">
                <Link to="/">
                    <img src={MainLogo} alt="logo" style={{ width: '180px', height: 'auto' }} />
                </Link>
            </section>
            <section className="navbar-links">
                <Link to="/" style={linkStyle}>Home</Link>
            </section>
            <section className="navbar-links">
                <Link to="/rides" style={linkStyle}>Rides</Link>
            </section>
            <section className="navbar-links">
                <Link to="/attractions" style={linkStyle}>Attractions</Link>
            </section>
            <section className="navbar-links">
                <Link to="/events" style={linkStyle}>Events</Link>
            </section>
            <section className="navbar-links">
                <Link to="/about" style={linkStyle}>About Us</Link>
            </section>
        </div>
    );
};

export default Navbar;
