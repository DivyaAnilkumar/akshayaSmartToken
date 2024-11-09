
import React, { useState } from "react";
// import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";  // Optional icon imports
import "./Register.css";
import { register } from "../services/AuthService";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "" // Default value for the role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData).then(
        () => {
            alert("Registration successful")
        },
        (error) => {
            console.error(error);
            alert('Registration failed');
        }
    )
     console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="register-page">
    <div className="register-container">
      <div className="register-card">
        <h2>Sign Up</h2>
        <p>Join us and start your journey!</p>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled  hidden>Select Role</option>
              <option value="user">User</option>
              <option value="Admin">Admin</option>
              <option value="Akshaya Center">Akshaya Center</option>
            </select>
          </div>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div> */}
          <button type="submit" className="register-button">
            Register
          </button>
          <div className="login-link">
            Already have an account? <a href="/login">Login</a>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Register;

