const Attendance = require('../models/attendanceModel');

const startAttendance = async (req, res) => {
    const { userId } = req.user;
    const startTime = Date.now();

    try {
        const attendance = new Attendance({
            userId,
            startTime,
        });

        await attendance.save();
        res.status(201).json({ message: 'דיווח התחלת נוכחות התקבל בהצלחה' });
    } catch (err) {
        res.status(500).json({ message: 'שמירת התחלת נוכחות נכשלה', error: err });
    }
};


const endAttendance = async (req, res) => {
    const { userId } = req.user;
    const endTime = Date.now();

    try {
        const attendance = await Attendance.findOne({ userId,  endTime: null }).sort({ startTime: -1 });
        
        if (!attendance) {
            return res.status(404).json({ message: 'לא נמצאה רשומת נוכחות פתוחה עבורך' });
        }

        attendance.endTime = endTime;
        await attendance.save();
        res.status(200).json({ message: 'דיווח סיום נוכחות התקבל בהצלחה' });
    } catch (err) {
        res.status(500).json({ message: 'שמירת סיום נוכחות נכשלה', error: err  });
    }
}


exports.startAttendance = startAttendance;
exports.endAttendance = endAttendance;