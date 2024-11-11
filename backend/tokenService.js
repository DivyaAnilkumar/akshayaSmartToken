
const nodemailer = require('nodemailer');
const Token = require('./models/tokenModel');
const AkshayaCenter = require('./models/AkshayaCenter');
const User = require('./models/user');

// Configure Nodemailer with your email provider details
const transporter = nodemailer.createTransport({
    service: 'gmail', // Adjust if you use a different email provider
    auth: {
        user: 'div2024123@gmail.com', // Replace with your Gmail address
        pass: 'elax nsxu qtdi jdmf',    // Use an app password if 2FA is enabled
    },
});

// Function to send an email
async function sendEmail(to, subject, text) {
    try {
        const mailOptions = {
            from: 'div2024123@gmail.com', // Replace with your sender email
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Helper function to check tokens generated today
let lastEmailDate = null;  // Track last email date in memory

async function checkTokens() {
    try {
        const today = new Date();
        const currentDate = today.toDateString();

        // If last email date is not set or the date has changed, send emails
        if (lastEmailDate !== currentDate) {
            // Get today's tokens (same as in the previous example)
            const tokensToday = await Token.find({
                createdAt: { $gte: today.setHours(0, 0, 0, 0) }, // Get today's tokens
                status: 'pending',
            }).populate('userId centerId');

            for (const token of tokensToday) {
                const { userId, centerId, tokenNumber } = token;

                if (!centerId || !userId) continue;

                if (tokenNumber === centerId.currentServicingTokenNumber + 3) {
                    const emailBody = `Dear ${userId.name}, your token number ${tokenNumber} is approaching soon.`;
                    await sendEmail(userId.email, 'Your Token is Approaching', emailBody);
                    console.log(`Notification sent to ${userId.email} for token number ${tokenNumber}`);
                }
            }

            // Update the in-memory last email date
            lastEmailDate = currentDate;
        }
    } catch (error) {
        console.error('Error checking tokens:', error);
    }
}


// async function checkTokens() {
//     try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); // Set to the start of today

//         // Find tokens generated today and check if they're 3 tokens away from the current token
//         const tokensToday = await Token.find({
//             createdAt: { $gte: today },
//             status: 'pending'
//         }).populate('userId centerId');

//         for (const token of tokensToday) {
//             const { userId, centerId, tokenNumber } = token;

//             if (!centerId || !userId) continue; // Skip if center or user is missing

//             // Check if this token is 3 tokens ahead of the current servicing token at the center
//             if (tokenNumber === centerId.currentServicingTokenNumber + 3) {
//                 // Construct a dynamic email body based on token details
//                 const emailBody = `Dear ${userId.name},\n\n` +
//                                   `Your token number ${tokenNumber} is approaching soon. ` +
//                                   `Please be prepared as it will be serviced shortly.\n\n` +
//                                   `Thank you for using our service.\n` +
//                                   `Best Regards,\n` +
//                                   `Akshaya Center`;

//                 // Send email to the user
//                 await sendEmail(userId.email, 'Your Token is Approaching', emailBody);
//                 console.log(`Notification sent to ${userId.email} for token number ${tokenNumber}`);
//             }
//         }
//     } catch (error) {
//         console.error('Error checking tokens:', error);
//     }
// }

module.exports = { checkTokens };


