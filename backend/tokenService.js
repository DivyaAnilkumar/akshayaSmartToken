
const nodemailer = require('nodemailer');
const Token = require('./models/tokenModel');
const AkshayaCenter = require('./models/AkshayaCenter');
const User = require('./models/user');
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'div2024123@gmail.com', 
        pass: 'elax nsxu qtdi jdmf',    
    },
});


async function sendEmail(to, subject, text) {
    try {
        const mailOptions = {
            from: 'div2024123@gmail.com', 
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

async function checkTokens() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        
        const tokensToday = await Token.find({
            createdAt: { $gte: today },
            status: 'pending',
        }).populate('userId centerId');

        for (const token of tokensToday) {
            const { userId, centerId, tokenNumber, lastEmailDate } = token;

            if (!centerId || !userId) continue;

            const emailHasBeenSentToday = lastEmailDate && new Date(lastEmailDate).toDateString() === today.toDateString();

            if (!emailHasBeenSentToday && tokenNumber === centerId.currentServicingTokenNumber + 3) {
                const emailBody = `Dear ${userId.name},\n\n` +
                                                 `Your token number ${tokenNumber} is approaching soon. ` +
                                                  `Please be prepared as it will be serviced shortly.\n\n` +
                                                  `Thank you for using our service.\n` +
                                                  `Best Regards,\n` +
                                                  `${centerId.centerName} ${centerId.location}`;
                
                await sendEmail(userId.email, 'Your Token is Approaching', emailBody);
                console.log(`Notification sent to ${userId.email} for token number ${tokenNumber}`);
                
            
                token.lastEmailDate = today;
                await token.save();
            }
        }
    } catch (error) {
        console.error('Error checking tokens:', error);
    }
}





module.exports = { checkTokens };


