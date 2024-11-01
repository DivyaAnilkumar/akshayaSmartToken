const express = require('express');
const connectDB = require('./db/connection');
const authRoutes = require('./routes/adminLoginRoutes');
require('dotenv').config();

const app = express();
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
