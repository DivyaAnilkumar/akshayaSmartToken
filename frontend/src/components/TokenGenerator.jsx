import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Button, Typography, Card, CardContent, CircularProgress, Box, Alert } from '@mui/material';

const TokenGenerator = () => {
  const { centerId } = useParams();
  const location = useLocation();
  const [center, setCenter] = useState(null);
  const [tokenNumber, setTokenNumber] = useState(null);
  const [tokenDetails, setTokenDetails] = useState({});
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCenterDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/akshaya-center/${centerId}`);
        setCenter(response.data);
      } catch (error) {
        setError('Failed to load center details. Please try again.');
      }
    };

    fetchCenterDetails();
  }, [centerId]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    } else {
      setError('User not logged in');
    }
  }, []);

  const handleGenerateToken = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/users/generate-token', {
        centerId,
        userId
      });

      setTokenNumber(response.data.tokenNumber);
      setMessage('Token generated successfully!');
      fetchTokenDetails(response.data.tokenId);
    } catch (err) {
      if (err.response && err.response.data.message.includes('Token generation is currently disabled')) {
        setMessage('Token generation is currently disabled for this center.');
      } else if (err.response && err.response.data.message.includes('only generate one token per day')) {
        setMessage('You can only generate one token per day at this center.');
      } else {
        setError(err.response?.data.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTokenDetails = async (tokenId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/token-details/${tokenId}`);
      setTokenDetails(response.data);
    } catch (error) {
      setError('Failed to fetch token details');
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!center) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
        <Typography variant="h4" gutterBottom>{center.centerDetails.centerName || 'Center Name Not Available'}</Typography>
        <Typography><strong>Location:</strong> {center.centerDetails.location || 'Location Not Available'}</Typography>
        
        <Typography variant="h6" gutterBottom>Token Information</Typography>
        <Typography><strong>Current Token:</strong> {center.centerDetails.currentServicingTokenNumber || 'N/A'}</Typography>
        <Typography><strong>Total People Waiting:</strong> {center.centerDetails.currentPeopleCount || 'N/A'}</Typography>

        <Button
          variant="contained" 
          color="primary" 
          onClick={handleGenerateToken} 
          disabled={isLoading}
          sx={{ margin: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Generate Token'}
        </Button>
        
        {/* Display Success or Error Message */}
        {message && <Alert severity="info" sx={{ marginTop: 2 }}>{message}</Alert>}
        {tokenNumber && (
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Your token number is: <strong>{tokenNumber}</strong>
          </Typography>
        )}

        {tokenDetails.tokenNumber && (
          <Card variant="outlined" sx={{ marginTop: 3, width: '100%', maxWidth: 500 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Token Details</Typography>
              <Typography><strong>Token Number:</strong> {tokenDetails.tokenNumber}</Typography>
              <Typography><strong>Date:</strong> {tokenDetails.date}</Typography>
              <Typography><strong>Username:</strong> {tokenDetails.username}</Typography>
              <Typography><strong>Center Name:</strong> {tokenDetails.centerName}</Typography>
              <Typography><strong>Location:</strong> {tokenDetails.location}</Typography>
              <Typography><strong>Services:</strong> {tokenDetails.services?.join(', ')}</Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default TokenGenerator;




// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { Button, Typography, Card, CardContent, CircularProgress, Box } from '@mui/material';


// const TokenGenerator = () => {
//     const location = useLocation();
//     const { centerId } = location.state || {}; 
//     const [tokenNumber, setTokenNumber] = useState(null);
//     const [tokenDetails, setTokenDetails] = useState({});
//     const [error, setError] = useState('');
//     const [message, setMessage] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [userId, setUserId] = useState(null);
//     const [userRole, setUserRole] = useState(null);

//     useEffect(() => {
//         const userData = localStorage.getItem('user');
//         if (userData) {
//             const user = JSON.parse(userData);
//             setUserId(user.id);
//             setUserRole(user.role);
//         } else {
//             setError('User not logged in');
//         }
//     }, []);

//     const handleGenerateToken = async () => {
//         setIsLoading(true);
//         setMessage('');
//         setError('');

//         try {
//             console.log("Attempting to generate token with:", { centerId, userId });

//             const response = await axios.post('http://localhost:5000/api/users/generate-token', {
//                 centerId,
//                 userId 
//             });

//             setTokenNumber(response.data.tokenNumber);
//             setMessage('Token generated successfully!'); 

//             // Fetch the token details after generating the token
//             fetchTokenDetails(response.data.tokenId);
//         } catch (err) {
//             if (err.response) {
//                 const errorMsg = err.response.data.message || 'An error occurred. Please try again.';
//                 if (errorMsg.includes('only generate one token per day')) {
//                     setMessage('You have already generated a token for this center today. Please try again tomorrow.');
//                     fetchTokenDetails(response.data.tokenId);
//                 } else {
//                     setError(errorMsg);
//                 }
//             } else {
//                 setError('A server error occurred. Please try again later.');
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Function to fetch token details
//     const fetchTokenDetails = async (tokenId) => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/users/token-details/${tokenId}`);
//             setTokenDetails(response.data); 
//         } catch (error) {
//             setError('Failed to fetch token details');
//         }
//     };

//     return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
//         <Typography variant="h4" gutterBottom>Generate Token</Typography>
//         <Button
//             variant="contained" 
//             color="primary" 
//             onClick={handleGenerateToken} 
//             disabled={isLoading} 
//             sx={{ margin: 2 }}
//         >
//             {isLoading ? <CircularProgress size={24} /> : 'Generate Token'}
//         </Button>
//         {message && <Typography color="success.main">{message}</Typography>}
//         {error && <Typography color="error.main">{error}</Typography>}

//         {tokenNumber && (
//             <Typography variant="h6" sx={{ marginTop: 2 }}>
//                 Your token number is: <strong>{tokenNumber}</strong>
//             </Typography>
//         )}

//         {tokenDetails.tokenNumber && (
//             <Card variant="outlined" sx={{ marginTop: 3, width: '100%', maxWidth: 500 }}>
//                 <CardContent>
//                     <Typography variant="h5" gutterBottom>Token Details</Typography>
//                     <Typography><strong>Token Number:</strong> {tokenDetails.tokenNumber}</Typography>
//                     <Typography><strong>Date:</strong> {tokenDetails.date}</Typography>
//                     <Typography><strong>Username:</strong> {tokenDetails.username}</Typography>
//                     <Typography><strong>Center Name:</strong> {tokenDetails.centerName}</Typography>
//                     <Typography><strong>Location:</strong> {tokenDetails.location}</Typography>
//                     <Typography><strong>Services:</strong> {tokenDetails.services?.join(', ')}</Typography>
//                 </CardContent>
//             </Card>
//         )}
//     </Box>
// );
//     //     <div>
//     //         <h2>Generate Token</h2>
//     //         <button onClick={handleGenerateToken} disabled={isLoading}>
//     //             {isLoading ? 'Generating...' : 'Generate Token'}
//     //         </button>
//     //         {message && <p style={{ color: 'green' }}>{message}</p>}
//     //         {tokenNumber && <p>Your token number is: <strong>{tokenNumber}</strong></p>}  
//     //         {error && <p style={{ color: 'red' }}>{error}</p>}

//     //         {/* Display token details if available */}
//     //         {tokenDetails.tokenNumber && (
//     //             <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
//     //                 <h3>Token Details</h3>
//     //                 <p><strong>Token Number:</strong> {tokenDetails.tokenNumber}</p>
//     //                 <p><strong>Date:</strong> {tokenDetails.date}</p>
//     //                 <p><strong>Username:</strong> {tokenDetails.username}</p>
//     //                 <p><strong>Center Name:</strong> {tokenDetails.centerName}</p>
//     //                 <p><strong>Location:</strong> {tokenDetails.location}</p>
//     //                 <p><strong>Services:</strong> {tokenDetails.services?.join(', ')}</p>
//     //             </div>
//     //         )}
//     //     </div>
//     // );
// };

// export default TokenGenerator;


// // import React, { useState, useEffect } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import axios from 'axios';

// // const TokenGenerator = () => {
// //     const location = useLocation();
// //     const { centerId } = location.state || {}; // Get centerId from location state
// //     const [tokenNumber, setTokenNumber] = useState(null);
// //     const [error, setError] = useState('');
// //     const [message, setMessage] = useState(''); // Friendly message
// //     const [isLoading, setIsLoading] = useState(false);
// //     const [userId, setUserId] = useState(null);
// //     const [userRole, setUserRole] = useState(null);

// //     // Retrieve userId and role from localStorage
// //     useEffect(() => {
// //         const userData = localStorage.getItem('user');
// //         if (userData) {
// //             const user = JSON.parse(userData); // Parse the user object
// //             setUserId(user.id); // Set userId
// //             setUserRole(user.role); // Set userRole
// //         } else {
// //             setError('User not logged in');
// //         }
// //     }, []);

// //     console.log('userId from localStorage:', userId);
// //     console.log('userRole from localStorage:', userRole);

// //     if (!userId) {
// //         console.error("User ID is missing in localStorage.");
// //         return <div>{error}</div>;
// //     }

// //     // Handle the rest of your logic for token generation here
// //     const handleGenerateToken = async () => {
// //         if (!centerId) {
// //             setError('Center ID is missing');
// //             return;
// //         }
        
// //         try {
// //             setIsLoading(true);
// //             const response = await axios.post('http://localhost:5000/api/users/generate-token', { userId, centerId });
// //             setTokenNumber(response.data.tokenNumber); // Assuming API returns a tokenNumber
// //             setMessage('Token generated successfully');
// //         } catch (err) {
// //             setError('Error generating token');
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     return (
// //         <div>
// //             <h3>Generate Token</h3>
// //             {error && <div className="error">{error}</div>}
// //             {message && <div className="message">{message}</div>}

// //             {/* Display token generation button and logic */}
// //             <button onClick={handleGenerateToken} disabled={isLoading}>
// //                 {isLoading ? 'Generating...' : 'Generate Token'}
// //             </button>
// //             {tokenNumber && <div>Generated Token Number: {tokenNumber}</div>}
// //         </div>
// //     );
// // };

// // export default TokenGenerator;
