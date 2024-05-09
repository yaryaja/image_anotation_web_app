import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registration.css'; // Custom CSS file for additional styling

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', { email, password });
      if (response.status === 200) {
        // setLoggedIn(true);
        setError('Successfully registered. Login now!!');

      } else {
        setError('Registration unsuccessful. Please try again.');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  const navigateToSignIn = () => {
    navigate('/');
  };

  return (
    <div className="container registration-container">
      <div className="row justify-content-center align-items-center vh-100">
          <div className="card registration-card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Registration</h2>
              <form onSubmit={handleRegistration}>
                <div className="form-group">
                  <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Register</button>
                {error && <p className="text-danger mt-3">{error}</p>}
              </form>
              <button onClick={navigateToSignIn} className="btn btn-link btn-block mt-3">Sign In</button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Registration;
