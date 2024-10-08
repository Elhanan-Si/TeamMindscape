import React from 'react';
import { Routes, Route } from 'react-router-dom';

import TasksPage from '../pages/TasksPage';
import EmployeesPage from '../pages/EmployeesPage';
import StatisticsPage from '../pages/StatisticsPage';
import FormAddUser from '../components/FormAddUser';
import FormAddTask from '../components/FormAddTask';
import Attendance from '../components/Attendance';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/tasks' element={<TasksPage />} />
            <Route path='/addTasks' element={<FormAddTask />} />
            <Route path='/addUser' element={<FormAddUser />} />
            <Route path='/employeesManagement' element={<EmployeesPage />} />
            <Route path='/statistics' element={<StatisticsPage />} />
            <Route path='/addUser' element={<FormAddUser />} />
            <Route path='/attendance' element={<Attendance />} />
        </Routes>
    )
}

export default AppRoutes;