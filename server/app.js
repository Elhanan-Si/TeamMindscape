const express = require('express');
const connectdb = require('./mongodb');
const cookieParser = require('cookie-parser');
const authenticationMiddleware = require('./middleware/authenticationMiddleware');
const cors = require('cors');


const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json());
app.use(cookieParser());
connectdb()

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoute');
const userRoutes = require('./routes/userRoute');
const attendanceRoute = require('./routes/attendanceRoute');
const statisticsRoutes = require('./routes/statisticsRoutes');

const protectedRoutes = express.Router();
protectedRoutes.use(authenticationMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', protectedRoutes, taskRoutes);
app.use('/api/users', protectedRoutes, userRoutes);
app.use('/api/attendance', protectedRoutes, attendanceRoute);
app.use('/api/statistics', protectedRoutes, statisticsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`);
});