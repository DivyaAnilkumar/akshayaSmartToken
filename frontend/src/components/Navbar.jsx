// Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close the menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>MySite</h1>
      </div>
      <button className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <li><Link to="/home" onClick={handleLinkClick}>Home</Link></li>
        <li><Link to="/list" onClick={handleLinkClick}>About</Link></li>
        <li><Link to="/services" onClick={handleLinkClick}>Services</Link></li>
        <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
