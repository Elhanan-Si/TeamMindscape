const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.COMPANY_MAIL,
        pass: process.env.COMPANY_MAIL_PASS
    },
});

const emailTemplates = {
    welcome: path.join(__dirname, 'templates', 'welcomeEmail.html'),
    verificationCode: path.join(__dirname, 'templates', 'verificationCodeEmail.html'),
    notification: path.join(__dirname, 'templates', 'notificationEmail.html')
};

const subjects = {
    welcome: 'Welcome to TeamMindscape!',
    verificationCode: 'Your Verification Code',
    notification: 'Your Details Have Been Updated'
};




const sendMail = (emailAddresses, emailType, replacements) => {
    const emailFilePath = emailTemplates[emailType];
    const subject = subjects[emailType];

    fs.readFile(emailFilePath, 'utf8', (err, data) => {
        if (err) {
            return console.error('Error reading HTML file:', err);
        }

        let emailContent = data;

        // החלפת כל התגים בתבנית בערכים המתאימים מתוך האובייקט
        for (const [key, value] of Object.entries(replacements)) {
            emailContent = emailContent.replace(new RegExp(`{{${key}}}`, 'g'), value); // ביטוי רגולרי שמחליף את כל המופעים של המפתח עם הערך
        }

        const mailOptions = {
            from: {
                name: "TeamMindscape",
                address: process.env.COMPANY_MAIL,
            },
            to: emailAddresses,
            subject: subject,
            html: emailContent,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response); 
            }
        });
    });
};

exports.sendMail = sendMail;



// https://myaccount.google.com/apppasswords. 




