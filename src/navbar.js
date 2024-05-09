import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Custom CSS file for additional styling
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({ loggedIn, setLoggedIn }) => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate(); // Initialize navigate for navigation

    
  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true); // Set loggedIn to true if token exists
    }
  }, []);


    const toggleNavbar = () => {
        setExpanded(!expanded);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token from localStorage
        setLoggedIn(false); // Set loggedIn state to false
        navigate("/"); // Navigate to the home page
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/Home">Your Logo</Link>
                <button className={`navbar-toggler ${expanded ? 'collapsed' : ''}`} type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded={expanded} aria-label="Toggle navigation" onClick={toggleNavbar}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/services">Services</Link>
                        </li>
                        {loggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/contact">Contact</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
