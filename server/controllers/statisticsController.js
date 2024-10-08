const Task = require('../models/taskModel');
const Attendance = require('../models/attendanceModel');


const getTasksCompletedStatistics = async (req, res) => {
    let completedOnTime = 0;
    let completedLate = 0;
    let notCompleted = 0;

    if (req.user.permissionLevel !== 'CEO') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const tasksData = await Task.find({}, { _id: 1, createdAt: 1, completedAt: 1, deadline: 1, isCompleted: 1 });
        tasksData.forEach(task => {
            if (task.isCompleted) {
                if (task.completedAt <= task.deadline) {
                    completedOnTime++;
                } else {
                    completedLate++;
                }
            } else {
                notCompleted++;
            }
        });

        const tasksStatistics = {
            completedOnTime,
            completedLate,
            notCompleted
        };

        return res.status(200).json(tasksStatistics);
    } catch (error) {
        console.error('Error fetching task statistics: ', error);
        return res.status(500).json({ message: "An error occurred while fetching task statistics", error });
    }
};


const getWorkHoursStatistics = async (req, res) => {
    const workHoursByDate = {};

    if (req.user.permissionLevel !== 'CEO') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const attendanceData = await Attendance.find({});

        attendanceData.forEach(record => {
            if (record.endTime) {
                const dateKey = new Date(record.startTime).toISOString().split('T')[0]; // חותך את התאריך מהזמן
                const workHours = (new Date(record.endTime) - new Date(record.startTime)) / (1000 * 60 * 60); // זמן העבודה בשעות

                if (!workHoursByDate[dateKey]) {
                    workHoursByDate[dateKey] = {
                        totalHours: 0,
                        count: 0,
                    };
                }

                workHoursByDate[dateKey].totalHours += workHours;
                workHoursByDate[dateKey].count += 1;
            }
        });

        const statisticsData = Object.keys(workHoursByDate).map(dateKey => ({
            x: dateKey, // תאריך
            y: workHoursByDate[dateKey].totalHours / workHoursByDate[dateKey].count // ממוצע שעות העבודה
        }));
        
        return res.status(200).json(statisticsData);
    } catch (error) {
        console.error("Error fetching Attendance data: ", error);
        return res.status(500).json({ message: "An error occurred while fetching Attendance data", error });
    }
};


const getEmployeeTaskStatistics = async (req, res) => {
    if (req.user.permissionLevel !== 'CEO') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const tasksData = await Task.find({ intendedFor: req.params.employeeId }, { _id: 1, createdAt: 1, completedAt: 1, deadline: 1, isCompleted: 1});

        let completedLate = 0;

        tasksData.forEach(task => {
            if (task.deadline < new Date() || task.completedAt >= task.deadline) {
                completedLate++;
            }
        });

        const tasksStatistics = {
            completedLate,
        };

        return res.status(200).json(tasksStatistics);
    } catch (error) {
        console.error('Error fetching task statistics: ', error);
        return res.status(500).json({ message: 'An error occurred while fetching task statistics', error });
    }
};


const getEmployeeWorkHoursStatistics = async (req, res) => {
    if (req.user.permissionLevel !== 'CEO') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const attendanceData = await Attendance.find({ userId: req.params.employeeId });

        let totalHours = 0;
        let daysWorked = new Set(); // ספירה של הימים למניעת ספירה כפולה

        attendanceData.forEach(record => {
            if (record.endTime) {
                const hoursWorked = (new Date(record.endTime) - new Date(record.startTime)) / (1000 * 60 * 60);
                totalHours += hoursWorked;
                const workDate = new Date(record.startTime).toDateString();
                daysWorked.add(workDate);
            }
        });

        const avgDailyHours = daysWorked.size > 0 ? (totalHours / daysWorked.size).toFixed(2) : 0;
        return res.status(200).json({ avgDailyHours });
    } catch (error) {
        console.error('Error fetching work hours statistics: ', error);
        return res.status(500).json({ message: "An error occurred while fetching work hours statistics", error });
    }
}



exports.getTasksCompletedStatistics = getTasksCompletedStatistics;
exports.getWorkHoursStatistics = getWorkHoursStatistics;
exports.getEmployeeTaskStatistics = getEmployeeTaskStatistics;
exports.getEmployeeWorkHoursStatistics = getEmployeeWorkHoursStatistics;