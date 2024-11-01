import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous error

    if (email === '' || password === '') {
      setError('Please fill in all fields');
      return;
    }

    // Handle authentication logic here
    console.log('Admin Logged In:', { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>
          <button type="submit">Login</button>
          <p className="forgot-password">
            <a href="#">Forgot Password?</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
