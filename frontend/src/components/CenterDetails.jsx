// // CenterDetails.js
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const CenterDetails = () => {
//   const { centerId } = useParams(); // Extract centerId from the URL
//   const [centers, setCenters] = useState([]);
//   const [tokenInfo, setTokenInfo] = useState({});

//   useEffect(() => {
//     // Fetch the details of the selected center
//     const fetchCenterDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/users/akshaya-center/${centerId}`);
//         setCenters(response.data);
//         fetchTokenInfo(); // Fetch token info after getting center details
//       } catch (error) {
//         console.error("Error fetching center details:", error);
//       }
//     };
    
//     fetchCenterDetails();
//   }, [centerId]);

//   const fetchTokenInfo = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/users/akshaya-center/${centerId}`);
//       setTokenInfo(response.data);
//     } catch (error) {
//       console.error("Error fetching token info:", error);
//     }
//   };

//   const generateToken = async () => {
//     try {
//       const response = await axios.post(`http://localhost:5000/api/users/generate-token`);
//       setTokenInfo(response.data); // Update token info with new token details
//     } catch (error) {
//       console.error("Error generating token:", error);
//     }
//   };

//   if (!center) return <p>Loading...</p>;

//   return (
//     <div>
//     {centers.map((center) => (
//     <div key={center._id}>
     
//       <h1>{center.centerName}</h1>
//       <p><strong>Location:</strong>{center.location}</p>
//       {/* <p><strong>Services:</strong> {center.services.join(', ')}</p> */}

//       <h2>Token Information</h2>
//       <p><strong>Current Token:</strong> {tokenInfo.currentToken || 'N/A'}</p>
//       <p><strong>Total People Waiting:</strong> {tokenInfo.totalPeople || 'N/A'}</p>
//       </div>
//    ) )}

//       <button onClick={generateToken}>Generate Token</button>
//     </div>
//   );
// }


// export default CenterDetails;

import React, { useState, useEffect } from 'react';
import { useParams,  useNavigate } from 'react-router-dom';
import axios from 'axios';

const CenterDetails = () => {
  const { centerId } = useParams();
  const [center, setCenter] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCenterDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/akshaya-center/${centerId}`);
        console.log("API Response:", response.data); // Log the response data
        console.log("Rendering Center:", center);

        setCenter(response.data);
      } catch (error) {
        console.error("Error fetching center details:", error);
        setError("Failed to load center details. Please try again.");
      }
    };

    fetchCenterDetails();
  }, [centerId]);

  function handleGenerateTokenClick(centerId){
    navigate('/generate-token',{state:{centerId}})
  }

  // const handleGenerateTokenClick = () => {
  //   // Navigate to the TokenGenerator component, passing the centerId
  //   navigate('/generate-token');
  // };

  if (error) return <p>{error}</p>;
  if (!center) return <p>Loading...</p>;
 
  console.log("Center ID from Params:", centerId);
  console.log("Rendering Center:", center);
  console.log("Center Name:", center.centerDetails.centerName);
  console.log("Location:", center.centerDetails.location);
  console.log("Current Token:", center.centerDetails.currentServicingTokenNumber);
  console.log("People Count:", center.centerDetails.currentPeopleCount);

  return (
    <div>
      
      <h1>{center.centerDetails.centerName || 'Center Name Not Available'}</h1>
      <p><strong>Location:</strong> {center.centerDetails.location || 'Location Not Available'}</p>
      <h2>Token Information</h2>
      <p><strong>Current Token:</strong> {center.centerDetails.currentServicingTokenNumber || 'N/A'}</p>
      <p><strong>Total People Waiting:</strong> {center.centerDetails.currentPeopleCount || 'N/A'}</p>
      <button onClick={()=>{handleGenerateTokenClick(centerId)}}>Generate Token</button>
    </div>
  );
};

export default CenterDetails;

