const Task = require("../models/taskModel");
const Attendance = require("../models/attendanceModel");

const getTasksCompletedStatistics = async (req, res) => {
  let completedOnTime = 0;
  let completedLate = 0;
  let notCompleted = 0;

  if (req.user.permissionLevel !== "CEO") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const tasksData = await Task.find(
      {},
      { _id: 1, createdAt: 1, completedAt: 1, deadline: 1, isCompleted: 1 }
    );
    tasksData.forEach((task) => {
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
      notCompleted,
    };

    return res.status(200).json(tasksStatistics);
  } catch (error) {
    console.error("Error fetching task statistics: ", error);
    return res.status(500).json({
      message: "An error occurred while fetching task statistics",
      error,
    });
  }
};

const getWorkHoursStatistics = async (req, res) => {
  const workHoursByDate = {};
  const workHoursByWeek = {};
  const workHoursByMonth = {};

  if (req.user.permissionLevel !== "CEO") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const attendanceData = await Attendance.find({});

    attendanceData.forEach((record) => {
      if (record.endTime) {
        const startDate = new Date(record.startTime);
        const dateKey = startDate.toISOString().split("T")[0];
        const weekKey = getWeekKey(startDate);
        const monthKey = getMonthKey(startDate);
        const workHours =
          (new Date(record.endTime) - startDate) / (1000 * 60 * 60);

        // Daily averages
        if (!workHoursByDate[dateKey]) {
          workHoursByDate[dateKey] = {
            totalHours: 0,
            count: 0,
          };
        }
        workHoursByDate[dateKey].totalHours += workHours;
        workHoursByDate[dateKey].count += 1;

        // Weekly averages
        if (!workHoursByWeek[weekKey]) {
          workHoursByWeek[weekKey] = {
            totalHours: 0,
            count: 0,
            date: dateKey, // שומר את התאריך הראשון בשבוע
          };
        }
        workHoursByWeek[weekKey].totalHours += workHours;
        workHoursByWeek[weekKey].count += 1;

        // Monthly averages
        if (!workHoursByMonth[monthKey]) {
          workHoursByMonth[monthKey] = {
            totalHours: 0,
            count: 0,
            date: dateKey, // שומר את התאריך הראשון בחודש
          };
        }
        workHoursByMonth[monthKey].totalHours += workHours;
        workHoursByMonth[monthKey].count += 1;
      }
    });

    const dailyData = Object.keys(workHoursByDate).map((dateKey) => ({
      x: dateKey,
      y: workHoursByDate[dateKey].totalHours / workHoursByDate[dateKey].count,
    }));

    const weeklyData = Object.values(workHoursByWeek).map((week) => ({
      x: week.date, // משתמש בתאריך הראשון של השבוע
      y: week.totalHours / week.count,
    }));

    const monthlyData = Object.values(workHoursByMonth).map((month) => ({
      x: month.date, // משתמש בתאריך הראשון של החודש
      y: month.totalHours / month.count,
    }));

    return res.status(200).json({
      daily: dailyData.sort((a, b) => a.x.localeCompare(b.x)),
      weekly: weeklyData.sort((a, b) => a.x.localeCompare(b.x)),
      monthly: monthlyData.sort((a, b) => a.x.localeCompare(b.x)),
    });
  } catch (error) {
    console.error("Error fetching Attendance data: ", error);
    return res.status(500).json({
      message: "An error occurred while fetching Attendance data",
      error,
    });
  }
};

const getEmployeeTaskStatistics = async (req, res) => {
  if (req.user.permissionLevel !== "CEO") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const tasksData = await Task.find(
      { intendedFor: req.params.employeeId },
      { _id: 1, createdAt: 1, completedAt: 1, deadline: 1, isCompleted: 1 }
    );

    let completedLate = 0;

    tasksData.forEach((task) => {
      if (task.deadline < new Date() || task.completedAt >= task.deadline) {
        completedLate++;
      }
    });

    const tasksStatistics = {
      completedLate,
    };

    return res.status(200).json(tasksStatistics);
  } catch (error) {
    console.error("Error fetching task statistics: ", error);
    return res.status(500).json({
      message: "An error occurred while fetching task statistics",
      error,
    });
  }
};

const getEmployeeWorkHoursStatistics = async (req, res) => {
  if (req.user.permissionLevel !== "CEO") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const attendanceData = await Attendance.find({
      userId: req.params.employeeId,
    });

    let totalHours = 0;
    let daysWorked = new Set(); // Set of unique work days
    let weeklyHours = {}; // Object to store hours by week
    let monthlyHours = {}; // Object to store hours by month

    attendanceData.forEach((record) => {
      if (record.endTime) {
        const startDate = new Date(record.startTime);
        const hoursWorked =
          (new Date(record.endTime) - startDate) / (1000 * 60 * 60);

        // For daily average
        totalHours += hoursWorked;
        const workDate = startDate.toDateString();
        daysWorked.add(workDate);

        // For weekly average
        const weekKey = getWeekKey(startDate);
        if (!weeklyHours[weekKey]) {
          weeklyHours[weekKey] = { total: 0, days: new Set() };
        }
        weeklyHours[weekKey].total += hoursWorked;
        weeklyHours[weekKey].days.add(workDate);

        // For monthly average
        const monthKey = getMonthKey(startDate);
        if (!monthlyHours[monthKey]) {
          monthlyHours[monthKey] = { total: 0, days: new Set() };
        }
        monthlyHours[monthKey].total += hoursWorked;
        monthlyHours[monthKey].days.add(workDate);
      }
    });

    // Calculate averages
    const avgDailyHours =
      daysWorked.size > 0 ? (totalHours / daysWorked.size).toFixed(2) : 0;

    // Calculate average weekly hours
    let totalWeeklyAvg = 0;
    let weeksCount = 0;
    Object.values(weeklyHours).forEach((week) => {
      if (week.days.size > 0) {
        totalWeeklyAvg += week.total / week.days.size;
        weeksCount++;
      }
    });
    const avgWeeklyHours =
      weeksCount > 0 ? (totalWeeklyAvg / weeksCount).toFixed(2) : 0;

    // Calculate average monthly hours
    let totalMonthlyAvg = 0;
    let monthsCount = 0;
    Object.values(monthlyHours).forEach((month) => {
      if (month.days.size > 0) {
        totalMonthlyAvg += month.total / month.days.size;
        monthsCount++;
      }
    });
    const avgMonthlyHours =
      monthsCount > 0 ? (totalMonthlyAvg / monthsCount).toFixed(2) : 0;

    return res
      .status(200)
      .json({ avgDailyHours, avgWeeklyHours, avgMonthlyHours });
  } catch (error) {
    console.error("Error fetching work hours statistics: ", error);
    return res.status(500).json({
      message: "An error occurred while fetching work hours statistics",
      error,
    });
  }
};

// Helper function to get week key (YYYY-WW)
function getWeekKey(date) {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week}`;
}

// Helper function to get month key (YYYY-MM)
function getMonthKey(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${month.toString().padStart(2, "0")}`;
}

// Helper function to get week number
function getWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

exports.getTasksCompletedStatistics = getTasksCompletedStatistics;
exports.getWorkHoursStatistics = getWorkHoursStatistics;
exports.getEmployeeTaskStatistics = getEmployeeTaskStatistics;
exports.getEmployeeWorkHoursStatistics = getEmployeeWorkHoursStatistics;
