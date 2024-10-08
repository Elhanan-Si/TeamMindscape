const mongoose = require("mongoose");
const Schema = mongoose.Schema

const AttendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);
module.exports = Attendance;