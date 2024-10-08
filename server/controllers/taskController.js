const Task = require('../models/taskModel');


const getTasks = async (req, res) => {
    try {
        const userId = req.user.userId;
        let tasks = await Task.find({ intendedFor: userId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error Tasks cannot be imported: ', error })
    }
}


const getTasksSent = async (req, res) => {
    if (!(req.user.permissionLevel === 'manager' || req.user.permissionLevel === 'CEO')) {
        res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const userName = req.user.userName;
        let tasks = await Task.find({ senderName: userName });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error Tasks cannot be imported: ', error })
    }
}


const createTask = async (req, res) => {
    try {
        if (req.user.permissionLevel === 'manager' || req.user.permissionLevel === 'CEO') {
            const { title, description, intendedFor, deadline, priority } = req.body;

            const newTask = new Task({
                title,
                description,
                senderName: req.user.userName,
                intendedFor,
                deadline,
                priority
            });
            await newTask.save();

            res.status(201).json({ message: 'Task created successfully' })
        } else {
            res.status(403).json({ message: 'Unauthorized' }); // חסימת יצירת משימה בגלל הרשאת משתמש
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to create task', error });
    }
}


const updateTask = async (req, res) => {
    try {
        if (req.user.permissionLevel === 'manager' || req.user.permissionLevel === 'CEO') {
            const { title, description, senderName, deadline, intendedFor, priority } = req.body;
            await Task.findByIdAndUpdate(req.body.taskId, { title, description, senderName, intendedFor, urgency });
            res.status(200).json({ message: 'Task updated successfully' });

        } else {
            res.status(403).json({ message: 'Unauthorized' }); // חסימת עדכון משימה בגלל הרשאת משתמש
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update task', error });
    }

    // רק מנהל ומנכל יכולים לערוך משימה
    // בדיקה עם העוגיה האם המשתמש הוא ברמה מתאימה
    // קבלת מזהה המשימה והנתונים לעדכון 
    // עדכון המשימה בבסיס נתונים
}


const deleteTask = async (req, res) => {
    // רק מנהל או מנכל יכולים למחוק משימה
    // בדיקה עם העוגיה האם המשתמש הוא ברמה מתאימה
    // קבלת מזהה המשימה
    // מחיקת המשימה מהבסיס נתונים

    try {
        if (req.user.permissionLevel === "CEO" || req.user.permissionLevel === "Manager") {
            const { taskId } =  req.params; 
            await Task.findByIdAndDelete(taskId);
            res.status(200).json({ message: 'Task deleted successfully' });
        } else {
            res.status(403).json({ message: 'Permission denied' }); // חסימת מחיקת משימה כי אין הרשאת משתמש
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task", error })
    }
}


const toggleTaskStatus = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        const isCompleted = !task.isCompleted;
        const completedAt = isCompleted ? new Date() : null;

        const updateTask = await Task.findByIdAndUpdate(
            taskId, 
            { isCompleted, completedAt }, 
            { new: true}
        );
        
        res.status(200).json({ message: 'Task status toggled successfully', isCompleted });
    } catch (error) {
        res.status(500).json({ message: "Failed to toggle task status", error });
    }
}

exports.getTasks = getTasks;
exports.getTasksSent = getTasksSent;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.toggleTaskStatus = toggleTaskStatus;



