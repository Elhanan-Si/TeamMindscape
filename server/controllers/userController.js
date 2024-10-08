const User = require("../models/userModel");
const bcrypt = require('bcrypt');
require("dotenv").config();
const { sendMail } = require("../services/emailService");


const getUserProfile = async (req, res) => {
    // משתמש מקבל את הנתונים שלו בלבד
    // מקבלים את המזהה משתמש מהעוגיה ולפי זה מחזירים את הנתונים שלו

    try {
        const userId = req.user.userId;
        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: "User not found"})
        }

        res.status(200).json(userData);
    } catch (error) {
        res.status(500).josn({ message: 'Error retrieving user data', error });
    }
};


const getUsers = async (req, res) => {
    // need: CEO OR manager
    // if CEO return all user data, if manager return just {._id, firstname, lastname, job}

    try {
        if (req.user.permissionLevel === 'CEO') {
            const usersData = await User.find();
            return res.status(200).json({ data: usersData, message: "get user success" });
        } else if (req.user.permissionLevel === 'Manager') {
            const usersData = await User.find({ _id: 1, firstname: 1, lastname: 1, job: 1 });
            return res.status(200).json({ data: usersData, message: "get user success" });
        } else {
            // אין הרשאה לקבלת נתוני משתמש
            res.status(403).json({ message: "Permission denied" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error importing users' });
    }
}


const createUser = async (req, res) => {
    try {
        if (req.user.permissionLevel === "CEO") {
            const { firstname, lastname, job, email, password, phone, permission } = req.body;

            // בדיקה שלא קיים משתמש עם אותו מייל
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User with this email already exists" });
            }
            
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
            const hashPassword = bcrypt.hashSync(password, saltRounds);

            const userPermission = permission === true ? "Manager" : "Worker";
            
            const newUser = new User({ firstname, lastname, job, email, password: hashPassword, phone, permissionLevel: userPermission });
            await newUser.save();
      
            sendMail(email, 'welcome', { userName: firstname, password: password});
            res.status(200).json({ message: "User created successfully" });
        } else {
            res.status(403).json({ message: "Permission denied" }); // אין הרשאה להוספת עובד
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to create user", error }); // שגיאה בהוספת עובד
    }
};


const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { firstname, lastname, job, email, phone, permission } = req.body;
    const currentUser = req.user;

    try {
        if (currentUser.permissionLevel !== 'CEO' && currentUser.userId !== userId) {
            return res.status(403).json({ message: "Permission denied" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (job) user.job = job;
        if (phone) user.phone = phone;
        if (currentUser.permissionLevel === 'CEO' && email) user.email = email;
        if (currentUser.permissionLevel === 'CEO' && permission) user.permissionLevel = permission;
            
        user.save();

        const updateUser = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            job: user.job,
            email: user.email,
            phone: user.phone,
            permissionLevel: user.permissionLevel
        }

        res.status(200).json({ message: "User updated successfully", data: updateUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error });
    }
};


const deleteUser = async (req, res) => {
    // רק מנכל יכול למחוק משתמש
    // בודקים מזהה מנכל
    // מקבלים את המזהה של המשתמש שמיועד למחיקה ומסירים מהבסיס נתונים

    try {
        if (req.user.permissionLevel === 'CEO') {
            const { userId } = req.params;
            await User.findByIdAndDelete(userId);
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(403).json({ message: "Permission denied" }); // אין הרשאה למחיקת משתמש
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
    }
};


exports.getUserProfile = getUserProfile;
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;