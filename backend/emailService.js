// // emailService.js
// const nodemailer = require('nodemailer');

// // Configure nodemailer with your email service credentials
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // Change to your email provider (e.g., Gmail, Outlook)
//     auth: {
//         user: 'divyaanilkumar24@gmail.com', // Replace with your email
//         pass: 'Divya@2003',  // Replace with your email password or app-specific password
//     },
// });

// // Function to send an email
// async function sendEmail({ to, subject, text }) {
//     try {
//         const mailOptions = {
//             from: 'divyaanilkumar24@gmail.com', // Replace with your sender email
//             to,
//             subject,
//             text,
//         };

//         await transporter.sendMail(mailOptions);
//         console.log(`Email sent to ${to}`);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// }

// module.exports = sendEmail;
