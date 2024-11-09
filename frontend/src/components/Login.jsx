// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// // import {jwt_decode} from 'jwt-decode';
// import '../styles/Auth.css';

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
//       const { token } = response.data;
//       const decoded = jwt_decode(token);
//       localStorage.setItem('token', token);
//       localStorage.setItem('role', decoded.role);
//       alert(`Logged in as ${decoded.role}`);
//       navigate('/dashboard');
//     } catch (error) {
//       alert('Login failed');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
//         <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from "react";
import "./Login.css";
import { login } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    login(email, password).then(
        (response) => {
            alert('Login successful');
            if (response.role === 'Admin') {
                navigate('/admin'); // Redirect to admin dashboard
            } else {
                navigate('/list'); // Redirect to user dashboard
            }
        },(error) => {
            console.error(error);
            alert('Login failed');
        }
    );
    console.log("Logging in with", { email, password });
  };

  return (
<div className="login-page">
<div className="login-container">
      <div className="login-form-container">
        <h2 className="login-heading">Welcome Back!</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            {/* <label htmlFor="email">Email</label> */}
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            {/* <label htmlFor="password">Password</label> */}
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          <div className="signup-link">
            Don't have an account? <a href="/register">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;
