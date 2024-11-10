
// import React, { useState } from "react";
// // import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";  // Optional icon imports
// import "./Register.css";
// import { register } from "../services/AuthService";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "" // Default value for the role
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     register(formData).then(
//         () => {
//             alert("Registration successful")
//         },
//         (error) => {
//             console.error(error);
//             alert('Registration failed');
//         }
//     )
//      console.log("Form Data Submitted:", formData);
//   };

//   return (
//     <div className="register-page">
//     <div className="register-container">
//       <div className="register-card">
//         <h2>Sign Up</h2>
//         <p>Join us and start your journey!</p>
//         <form onSubmit={handleSubmit} className="register-form">
//           <div className="input-group">
//             <select 
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               required
//             >
//               <option value="" disabled  hidden>Select Role</option>
//               <option value="user">User</option>
//               <option value="Admin">Admin</option>
//               <option value="Akshaya Center">Akshaya Center</option>
//             </select>
//           </div>
//           <div className="input-group">
//             <input
//               type="text"
//               name="name"
//               placeholder="Username"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           {/* <div className="input-group">
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//             />
//           </div> */}
//           <button type="submit" className="register-button">
//             Register
//           </button>
//           <div className="login-link">
//             Already have an account? <a href="/login">Login</a>
//           </div>
//         </form>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import "./Register.css";
import { register } from "../services/AuthService";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    // Clear error for the field being updated
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ""
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if role is selected
    if (!formData.role) {
      newErrors.role = "Please select a role.";
      console.log("Role validation failed");
    }

    // Validate name field
    if (!formData.name) {
      newErrors.name = "Name is required.";
      console.log("Name validation failed");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required.";
      console.log("Email validation failed (empty)");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
      console.log("Email validation failed (format)");
    }

    // Validate password length
    if (!formData.password) {
      newErrors.password = "Password is required.";
      console.log("Password validation failed (empty)");
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      console.log("Password validation failed (length)");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      register(formData)
        .then(() => {
          alert("Registration successful");
        })
        .catch((error) => {
          console.error(error);
          alert("Registration failed");
        });
      console.log("Form Data Submitted:", formData);
    } else {
      console.log("Validation failed, form not submitted");
    }
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
              >
                <option value="" disabled hidden>
                  Select Role
                </option>
                <option value="user">User</option>
                <option value="Admin">Admin</option>
                <option value="Akshaya Center">Akshaya Center</option>
              </select>
              {errors.role && <p className="error-message">{errors.role}</p>}
            </div>
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Username"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
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
