// backend/controllers/tokenController.js
const nodemailer = require('nodemailer');
const Token = require('../models/tokenModel');

// Mapping of carriers to their email-to-SMS domains
const carriers = {
    verizon: 'vtext.com',
    att: 'txt.att.net',
    tmobile: 'tmomail.net'
};

// Function to send SMS with token details
const sendTokenSMS = async (req, res) => {
    const { phoneNumber, carrier } = req.body;

    if (!carriers[carrier]) {
        return res.status(400).json({ success: false, message: 'Invalid carrier selected' });
    }

    try {
        // Fetch today's token details for the user
        const tokenDetails = await Token.findOne({
            userId: req.user.id,  // Assuming req.user is set after authentication
            createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
        }).populate('centerId');

        if (!tokenDetails) {
            return res.status(404).json({ success: false, message: 'No token found for today' });
        }

        // Construct the SMS message
        const message = `
            Token Number: ${tokenDetails.tokenNumber}
            Center Name: ${tokenDetails.centerId.centerName}
            Location: ${tokenDetails.centerId.location}
            Status: ${tokenDetails.status}
            Date: ${new Date(tokenDetails.createdAt).toLocaleString()}
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: `${phoneNumber}@${carriers[carrier]}`,
            text: message
        };

        // Send the email (SMS)
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending SMS:', error);
                return res.status(500).json({ success: false, message: 'Failed to send SMS' });
            }
            res.json({ success: true, message: 'SMS sent successfully!' });
        });
    } catch (error) {
        console.error('Error retrieving token details:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { sendTokenSMS };
