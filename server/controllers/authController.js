const User = require('../models/userModel');
const { sendMail } = require("../services/emailService");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
    
        // בודק אם אין מייל או שהסיסמה לא מתאימה
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    
        // יצירת אסימון עם מידע רלוונטי על המשתמש
        const token = jwt.sign(
            {
                email: user.email,
                permissionLevel: user.permissionLevel,
                userId: user._id,
                userName: user.firstname + " " + user.lastname
            },
                process.env.JWT_SECRET,
            { expiresIn: '6h' }
        );
    
        // הגדרת האסימון בעוגייה
        res.cookie("token", token, { httpOnly: true });
        
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during login", error: error.message });
    }
}


const verifyToken = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ authenticated: false })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        return res.json({ authenticated: true, user: decoded });
    } catch (error) {
        return res.status(401).json({ authenticated: false });
    }
}

const logout = async (req, res) => {
    res.cookie('token', '', { expires: new Date(0), path: '/' });
    res.status(200).json({ message: 'Logged out' });
}


const sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User " + email + " not found" })
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = Date.now() + 3600000 // שעה לתפוגה
        await user.save();

        sendMail(email, 'verificationCode', { code: verificationCode });

        res.status(200).json({ message: "Verification code sent" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
}


const resetPassword = async (req, res) => {
    const { email, verificationCode, newPassword } = req.body;

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        console.log(verificationCode, user.verificationCode)

        if (user.verificationCode !== verificationCode || user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }
        user.password = bcrypt.hashSync(newPassword, 10);
        user.verificationCode = undefined; 
        user.verificationCodeExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
}


exports.login = login;
exports.verifyToken = verifyToken;
exports.logout = logout
exports.sendVerificationCode = sendVerificationCode;
exports.resetPassword = resetPassword;