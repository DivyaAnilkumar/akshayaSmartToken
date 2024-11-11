const express = require('express');
const connectDB = require('./db/connection');
// const authRoutes = require('./routes/adminLoginRoutes');
const centerRoutes = require('./routes/centerRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const { checkTokens } = require('./tokenService');
const cron = require('node-cron');
// async function checkTokens() {
//     try {
//         console.log('Checking tokens...');  // Add this log to confirm if the function is being called
//         // Your existing logic...
//     } catch (error) {
//         console.error('Error checking tokens:', error);
//     }
// }
// const { checkTokens } = require('./tokenService');


const cors = require('cors');
// Schedule the checkTokens function to run daily at a specific time (e.g., 9:00 AM)
// cron.schedule('0 9 * * *', () => {
//     console.log('Running daily token check');
//     checkTokens();
// });
cron.schedule('* * * * *', () => {
    console.log('Running daily token check');
  checkTokens();
});


require('dotenv').config();

const app = express();
app.use(cors());
connectDB();


app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tokens',tokenRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
