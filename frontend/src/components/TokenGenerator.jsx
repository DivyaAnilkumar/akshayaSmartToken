import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const TokenGenerator = () => {
    const location = useLocation();
    const { centerId } = location.state || {}; // Get centerId from location state
    // const [tokenTime, setTokenTime] = useState('');
    const [tokenNumber, setTokenNumber] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // Friendly message
    const [isLoading, setIsLoading] = useState(false);
    const userId = '6727913c8b4c27d56708221a'; // Replace with the actual user ID logic



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
