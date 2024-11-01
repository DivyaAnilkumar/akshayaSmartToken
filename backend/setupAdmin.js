const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('./model/adminLogin');
require('dotenv').config();
const connectDB = require('./db/connection');

const setupAdmin = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new Admin({ email, password: hashedPassword });
  await admin.save();
  console.log('Admin user created');
  process.exit();
};

setupAdmin();
