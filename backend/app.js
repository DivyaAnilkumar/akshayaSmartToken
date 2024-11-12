const express = require('express');
const connectDB = require('./db/connection');
const centerRoutes = require('./routes/centerRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { checkTokens } = require('./tokenService');
const cron = require('node-cron');


const cors = require('cors');



require('dotenv').config();

const app = express();
app.use(cors());
connectDB();


app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/users', userRoutes);

cron.schedule('* * * * *', () => {
  console.log('Running daily token check');
checkTokens();
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
