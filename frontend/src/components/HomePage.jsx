// HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosinterceptor';

const HomePage = () => {
  const [centers, setCenters] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
 
    const fetchCenters = async () => {
      try {
       
        
        const response = await axiosInstance.get('http://localhost:5000/api/users/search-akshaya-centers');
        
        setCenters(response.data);
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };
    fetchCenters();
  }, []);

  // Filter centers based on search input for name, location, and services
  const filteredCenters = centers.filter(center => {
    const lowerCaseSearch = search.toLowerCase();
    const matchesName = center.centerName.toLowerCase().includes(lowerCaseSearch);
    const matchesLocation = center.location.toLowerCase().includes(lowerCaseSearch);
    // const matchesService = center.services.some(service =>
    //   service.toLowerCase().includes(lowerCaseSearch)
    // );

    return matchesName || matchesLocation ;
    // || matchesService; // Match any of the criteria
  });

  return (
    <>
      <Navbar />
      <div className="homepage">
        <h1>Akshaya Centers</h1>
        <input
          type="text"
          placeholder="Search by name, location, or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <div className="center-list">
          {filteredCenters.length > 0 ? (
            filteredCenters.map(center => (
              <div className="center-card" key={center._id} 
              onClick={() => navigate(`/center/${center._id}`)} // Navigate on card click>
              >
                <h2>{center.centerName}</h2>
                <p><strong>Location:</strong> {center.location}</p>
                {/* <p><strong>Services:</strong> {center.services.join(', ')}</p> */}
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
