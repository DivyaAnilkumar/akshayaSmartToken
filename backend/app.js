const express = require('express');
const connectDB = require('./db/connection');
const authRoutes = require('./routes/adminLoginRoutes');
const centerRoutes = require('./routes/centerRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
connectDB();


app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
