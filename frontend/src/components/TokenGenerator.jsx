import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const TokenGenerator = () => {
    const location = useLocation();
    const { centerId } = location.state || {}; // Get centerId from location state
    // const [tokenTime, setTokenTime] = useState('');
    const [tokenNumber, setTokenNumber] = useState(null);
    const [error, setError] = useState('');

    const handleGenerateToken = async () => {
        setError(''); // Clear previous errors
        try {
            const userId = '6727913c8b4c27d56708221a'; // Replace with the actual user ID logic
            const response = await axios.post('http://localhost:5000/api/users/generate-token', {
                centerId,
                // tokenTime,
                userId // Send userId as well
            });
            setTokenNumber(response.data.tokenNumber); // Set the token number
        } catch (err) {
            if (err.response && err.response.data.errors) {
                // Handle validation errors from the backend
                setError(err.response.data.errors.map(e => e.msg).join(', '));
            } else {
                // Handle other errors
                setError('An error occurred. Please try again.');
            }
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
            <button onClick={handleGenerateToken}>
                Generate Token
            </button>
            {tokenNumber && <p>Generated Token Number: {tokenNumber}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default TokenGenerator;
