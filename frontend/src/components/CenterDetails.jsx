// CenterDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CenterDetails = () => {
  const { centerId } = useParams(); // Extract centerId from the URL
  const [center, setCenter] = useState(null);
  const [tokenInfo, setTokenInfo] = useState({});

  useEffect(() => {
    // Fetch the details of the selected center
    const fetchCenterDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/akshaya-center/${centerId}`);
        setCenter(response.data);
        fetchTokenInfo(); // Fetch token info after getting center details
      } catch (error) {
        console.error("Error fetching center details:", error);
      }
    };
    
    fetchCenterDetails();
  }, [centerId]);

  const fetchTokenInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/akshaya-center/${centerId}`);
      setTokenInfo(response.data);
    } catch (error) {
      console.error("Error fetching token info:", error);
    }
  };

  const generateToken = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/users/generate-token`);
      setTokenInfo(response.data); // Update token info with new token details
    } catch (error) {
      console.error("Error generating token:", error);
    }
  };

  if (!center) return <p>Loading...</p>;

  return (
    <div>
      <h1>{center.centerName}</h1>
      <p><strong>Location:</strong>{center.location}</p>
      {/* <p><strong>Services:</strong> {center.services.join(', ')}</p> */}

      <h2>Token Information</h2>
      <p><strong>Current Token:</strong> {tokenInfo.currentToken || 'N/A'}</p>
      <p><strong>Total People Waiting:</strong> {tokenInfo.totalPeople || 'N/A'}</p>

      <button onClick={generateToken}>Generate Token</button>
    </div>
  );
};

export default CenterDetails;
