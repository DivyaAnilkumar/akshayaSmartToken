import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, CircularProgress, Button } from '@mui/material';
import Navbar from './Navbar';

const TokenDetails = () => {
    const [tokens, setTokens] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [userId,setUserId] = useState(null);
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUserId(user.id);
            // setUserRole(user.role);
        } else {
            setError('User not logged in');
        }
    }, []);

    useEffect(() => {
        // const userId = localStorage.getItem('user');
        // console.log(userId);
        
        if (userId) {
            axios.get(`http://localhost:5000/api/users/token-detail/${userId}`)
                .then(response => {
                    setTokens(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Error fetching token details');
                    setLoading(false);
                    console.error(err);
                });
        } else {
            // setError('User not logged in');
            setLoading(false);
        }
    }, [userId]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <><Navbar/>
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Token Details
            </Typography>

            {error && <Typography color="error" variant="body1">{error}</Typography>}

            {tokens.length > 0 ? (
                <Grid container spacing={3}>
                    {tokens.map((token, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Token Number: {token.tokenNumber}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        <strong>Username:</strong> {token.userId.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        <strong>Center Name:</strong> {token.centerId.centerName}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        <strong>Location:</strong> {token.centerId.location}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        <strong>Status:</strong> {token.status}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Date:</strong> {new Date(token.createdAt).toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">No tokens found</Typography>
            )}
        </div>
        </>
    );
};

export default TokenDetails;
