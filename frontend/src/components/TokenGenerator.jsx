import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
// import axiosInstance from './axiosInstance'; // Import the axios instance you've set up


const TokenGenerator = () => {
    const location = useLocation();
    const { centerId } = location.state || {}; // Get centerId from location state
    // const [tokenTime, setTokenTime] = useState('');
    const [tokenNumber, setTokenNumber] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // Friendly message
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData); // Parse the user object
            setUserId(user.id); // Set userId
            setUserRole(user.role); // Set userRole
        } else {
            setError('User not logged in');
        }
    }, []);

    console.log('userId from localStorage:', userId);
    console.log('userRole from localStorage:', userRole);

    if (!userId) {
        console.error("User ID is missing in localStorage.");
        return <div>{error}</div>;
    }



    const handleGenerateToken = async () => {
        setIsLoading(true);
        setMessage(''); // Clear previous message

        setError(''); // Clear previous errors
        try {
            console.log("Attempting to generate token with:", { centerId, userId }); // Debug log

            // const userId = '6727913c8b4c27d56708221a'; // Replace with the actual user ID logic
            // console.log("centerId:", centerId);
            const response = await axios.post('http://localhost:5000/api/users/generate-token', {
                centerId,
                // tokenTime,
                userId // Send userId as well
            });
            setTokenNumber(response.data.tokenNumber); // Set the token number
            setError(''); // Clear any previous error
            setMessage('Token generated successfully!'); // Friendly success message


        } catch (err) {
            if (err.response) {
                console.error("Response error:", err.response.data); // Log detailed error response

                const errorMsg = err.response.data.message || 'An error occurred. Please try again.';
                
                if (errorMsg.includes('only generate one token per day')) {
                    setMessage('You have already generated a token for this center today. Please try again tomorrow.');
                } else {
                    setError(errorMsg); 
                }
            } else {
                console.error("Request error:", err);
                // Handle other errors
                setError('A server error occurred. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Generate Token</h2>
            {/* <div>
                <label>Token Time:</label>
                <input
                    type="text"
                    value={tokenTime}
                    onChange={(e) => setTokenTime(e.target.value)}
                />
            </div> */}
            <button onClick={handleGenerateToken} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Token'}
            </button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {tokenNumber && <p>Your token number is: <strong>{tokenNumber}</strong></p>}  
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default TokenGenerator;




// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';

// const TokenGenerator = () => {
//     const location = useLocation();
//     const { centerId } = location.state || {}; // Get centerId from location state
//     const [tokenNumber, setTokenNumber] = useState(null);
//     const [error, setError] = useState('');
//     const [message, setMessage] = useState(''); // Friendly message
//     const [isLoading, setIsLoading] = useState(false);
//     const [userId, setUserId] = useState(null);
//     const [userRole, setUserRole] = useState(null);

//     // Retrieve userId and role from localStorage
//     useEffect(() => {
//         const userData = localStorage.getItem('user');
//         if (userData) {
//             const user = JSON.parse(userData); // Parse the user object
//             setUserId(user.id); // Set userId
//             setUserRole(user.role); // Set userRole
//         } else {
//             setError('User not logged in');
//         }
//     }, []);

//     console.log('userId from localStorage:', userId);
//     console.log('userRole from localStorage:', userRole);

//     if (!userId) {
//         console.error("User ID is missing in localStorage.");
//         return <div>{error}</div>;
//     }

//     // Handle the rest of your logic for token generation here
//     const handleGenerateToken = async () => {
//         if (!centerId) {
//             setError('Center ID is missing');
//             return;
//         }
        
//         try {
//             setIsLoading(true);
//             const response = await axios.post('http://localhost:5000/api/users/generate-token', { userId, centerId });
//             setTokenNumber(response.data.tokenNumber); // Assuming API returns a tokenNumber
//             setMessage('Token generated successfully');
//         } catch (err) {
//             setError('Error generating token');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div>
//             <h3>Generate Token</h3>
//             {error && <div className="error">{error}</div>}
//             {message && <div className="message">{message}</div>}

//             {/* Display token generation button and logic */}
//             <button onClick={handleGenerateToken} disabled={isLoading}>
//                 {isLoading ? 'Generating...' : 'Generate Token'}
//             </button>
//             {tokenNumber && <div>Generated Token Number: {tokenNumber}</div>}
//         </div>
//     );
// };

// export default TokenGenerator;
