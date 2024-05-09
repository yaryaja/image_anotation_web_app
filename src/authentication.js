import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Authentication.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Authentication = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setLoggedIn(true);
            navigate('/Home');
        }
    }, [navigate]);


    const handleAuthentication = async (e) => {
        e.preventDefault();
        try {
            console.log({ email, password });
            const response = await axios.post('http://localhost:5000/login', { email, password });
            console.log(response);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                console.log("okay");
                setLoggedIn(true); // Set loggedIn state to true upon successful authentication
                alert("Sucessfully Logged in!")
                navigate("/Home");
            } else {
                console.log('Authentication failed. Please check your email and password.');
            }
        } catch (error) {
            console.log('Error:', error); // Log any network or other errors
            console.log('Authentication failed. Please check your email and password.');
        }
    };

    // Function to navigate to the sign-up page
    const navigateToSignUp = () => {
        navigate('/signup'); // Redirect to the sign-up page
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token from localStorage
        setLoggedIn(false);
        // Additional logic for navigating to the logout page or wherever you need
      };

    return (
        <div className="container authentication-container"> 
          <div className="row justify-content-center">
              <div className="card authentication-card"> 
                <div className="card-body">
                  <h2 className="card-title text-center">Authentication</h2>
                  <form onSubmit={handleAuthentication}>
                    <div className="form-group">
                      <label>Email:</label>
                      <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Password:</label>
                      <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Login</button> {/* Add Bootstrap button class */}
                  </form>
                  <button onClick={navigateToSignUp} className="btn btn-link btn-block">Sign Up</button> {/* Add Bootstrap button class */}
                </div>
              </div>
          </div>
        </div>
      );
    };

export default Authentication;
